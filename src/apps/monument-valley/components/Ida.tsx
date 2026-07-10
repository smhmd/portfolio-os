import { useEffect, useLayoutEffect } from 'react'

import { useAnimations, useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { type Object3D, PlaneGeometry } from 'three'

import { HALF_PI } from 'src/lib/math'

import type { IdaAnimation } from '../lib'
import { materials } from '../lib/materials'

const MODEL = '/models/ida.glb'
const shadowGeo = new PlaneGeometry(0.56, 0.56).rotateX(-HALF_PI)

type IdaProps = ThreeElements['mesh'] & {
  animation: IdaAnimation
  ref: React.RefObject<Object3D>
  layers: number
}

export function Ida({ ref, animation, layers, ...props }: IdaProps) {
  const { scene, animations } = useGLTF(MODEL)
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    const action = actions[animation]
    if (!action) return
    action.reset().fadeIn(0.2).play()
    return () => {
      action.fadeOut(0.2)
    }
  }, [actions, animation])

  useLayoutEffect(() => {
    ref.current.traverse((object) => object.layers.set(layers))
  }, [layers])

  return (
    <group position={[-0.5, 1, 0.5]}>
      <primitive
        layers={layers}
        ref={ref}
        object={scene}
        scale={0.8}
        {...props}>
        <mesh
          layers={layers}
          position={[0, 0.01, -0.05]}
          geometry={shadowGeo}
          material={materials.radial}
        />
      </primitive>
    </group>
  )
}

useGLTF.preload(MODEL)
