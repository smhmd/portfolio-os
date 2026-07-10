import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { useAnimations, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type AnimationAction, type Group, LoopOnce, Quaternion } from 'three'

import { PI } from 'src/lib/math'

import { GAZE, GESTURE_FADE, SIMO_POSITION, SIMO_SCALE } from '../lib/common'
import { dialogue } from '../lib/dialogue'
import { applyFace, collectFaces, makeBlink } from '../lib/lipsync'
import { store } from '../lib/store'
import { voice } from '../lib/voice'

const MODEL = '/models/brown.glb'

const pose = new Quaternion() // scratch for the gaze blend

/**
 * Everything about the character lives here: the model, the idle loop,
 * one-shot gestures on node entry, lip-sync, blinks, and the gaze nudge.
 */
export function Simo() {
  const root = useRef<Group>(null)
  const node = store.use((s) => s.node)

  const { scene, animations } = useGLTF(MODEL)
  const { actions, mixer } = useAnimations(animations, root)
  const faces = useMemo(() => collectFaces(scene), [scene])
  const blink = useMemo(makeBlink, [])
  // adjust the name if your rig differs — log `animations`/bones to check
  const head = useMemo(
    () => scene.getObjectByName('Head') ?? scene.getObjectByName('Neck'),
    [scene],
  )

  useLayoutEffect(() => {
    actions.idle?.play() // the base layer, runs forever
    scene.traverse((o) => (o.castShadow = o.receiveShadow = true))
  }, [actions, scene])

  // Entering a node that names an `animation` plays it once over the idle,
  // crossfaded in and out. Cleanup returns to idle even if the gesture is
  // cut short by the next node.
  useEffect(() => {
    const idle = actions.idle
    const name = dialogue[node].animation
    const clip = name ? actions[name] : null
    if (!idle || !clip || clip === idle) return

    clip.reset().setLoop(LoopOnce, 1).crossFadeFrom(idle, GESTURE_FADE, false)
    clip.clampWhenFinished = true
    clip.play()

    const toIdle = () =>
      void idle.reset().crossFadeFrom(clip, GESTURE_FADE, false).play()
    const finished = ({ action }: { action: AnimationAction }) =>
      action === clip && toIdle()

    mixer.addEventListener('finished', finished)
    return () => {
      mixer.removeEventListener('finished', finished)
      if (clip.isRunning()) toIdle()
    }
  }, [node, actions, mixer])

  // This useFrame is registered *after* useAnimations' own, so it runs each
  // frame after the mixer has posed the skeleton and may adjust the result.
  useFrame(({ camera, clock }, delta) => {
    applyFace(faces, voice.playhead(), blink(clock.elapsedTime), delta)

    // Gaze nudge: the idle clip leaves the head aimed slightly off-camera;
    // blend GAZE of the way from the animated pose toward facing the
    // player. Delete this block (and GAZE) to remove the behaviour.
    if (head && GAZE) {
      pose.copy(head.quaternion) // what the mixer wrote this frame
      head.lookAt(camera.position)
      head.quaternion.slerp(pose, 1 - GAZE)
    }
  })

  return (
    <group ref={root} position={SIMO_POSITION} scale={SIMO_SCALE}>
      <primitive object={scene} dispose={null} rotation-y={PI} />
    </group>
  )
}

useGLTF.preload(MODEL)
