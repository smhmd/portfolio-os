import { useEffect, useLayoutEffect, useRef } from 'react'

import { PointerLockControls } from '@react-three/drei'
import { type ThreeElements, useFrame, useThree } from '@react-three/fiber'
import {
  DoubleSide,
  type Intersection,
  type Mesh,
  Raycaster,
  Vector2,
} from 'three'

import { isMobile } from 'src/lib/env'
import { clamp, HALF_PI } from 'src/lib/math'

import { DEBUG_HITBOXES } from '../lib/common'
import { type NodeId } from '../lib/dialogue'
import { api, store } from '../lib/store'

/**
 * The one interaction system. Anything actionable in the scene is a
 * <Hitbox goto=…>; nothing else takes input.
 *
 *   desktop  pointer lock + one centre-screen raycast per frame. The
 *            nearest hitbox becomes `focus` (crosshair ring, row
 *            highlight) and a click while locked follows it.
 *   mobile   drag-to-look; taps raycast through r3f's own event system
 *            straight into the hitbox's onClick.
 *
 * Hitboxes register in a module array, so "what is actionable" is exactly
 * "what is mounted": Scene mounts Simo's only before the conversation
 * starts, Choices mounts one per row only while rows are on screen.
 */

const hitboxes: Mesh[] = []

export function Hitbox({
  goto,
  children,
  ...props
}: ThreeElements['mesh'] & { goto: NodeId }) {
  const ref = useRef<Mesh>(null)

  useLayoutEffect(() => {
    const mesh = ref.current!
    mesh.userData.goto = goto
    hitboxes.push(mesh)
    return () => void hitboxes.splice(hitboxes.indexOf(mesh), 1)
  }, [goto])

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={isMobile ? () => api.goto(goto) : undefined}>
      {children}
      <meshBasicMaterial
        transparent
        opacity={DEBUG_HITBOXES ? 0.25 : 0}
        color='hotpink'
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

export function Interact() {
  return isMobile ? <TouchLook /> : <Gaze />
}

const raycaster = new Raycaster()
const CENTRE = new Vector2() // NDC (0, 0) = screen centre
const hits: Intersection[] = []

/** Crosshair focus + click-to-select, desktop only. */
function Gaze() {
  const { camera } = useThree()

  useFrame(() => {
    let focus: NodeId | null = null

    if (document.pointerLockElement && hitboxes.length) {
      raycaster.setFromCamera(CENTRE, camera)
      hits.length = 0
      raycaster.intersectObjects(hitboxes, false, hits)
      focus = (hits[0]?.object.userData.goto as NodeId) ?? null
    }

    store.set({ focus }) // no-op (no notify) when unchanged
  })

  useEffect(() => {
    const select = () => {
      // ignore the click that engages pointer lock; only act once locked
      if (!document.pointerLockElement) return
      const { focus } = store.get()
      if (focus) api.goto(focus)
    }

    window.addEventListener('pointerdown', select)
    return () => window.removeEventListener('pointerdown', select)
  }, [])

  // selector: only clicks on the canvas engage pointer lock
  return <PointerLockControls makeDefault selector='#stage' />
}

/** Drag-to-look for touch devices — pointer lock doesn't exist there. */
function TouchLook() {
  const { camera, gl } = useThree()

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'none'
    camera.rotation.reorder('YXZ')
    let x = 0
    let y = 0

    const down = (e: PointerEvent) => ((x = e.clientX), (y = e.clientY))
    const move = (e: PointerEvent) => {
      if (!e.buttons) return
      camera.rotation.y -= (e.clientX - x) * 0.005
      camera.rotation.x = clamp(
        -HALF_PI + 0.1,
        camera.rotation.x - (e.clientY - y) * 0.005,
        HALF_PI - 0.1,
      )
      x = e.clientX
      y = e.clientY
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
    }
  }, [camera, gl])

  return null
}
