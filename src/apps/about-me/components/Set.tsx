import { useLayoutEffect } from 'react'

import { useGLTF } from '@react-three/drei'

import { PI } from 'src/lib/math'

import { type ModelProps, MODELS } from '../lib/models'

/** The set dressing: static GLTF props arranged around the room. */
export function Set() {
  return (
    <group rotation-y={PI} position={[-2.22, 0, 1.38]} scale={1.4}>
      {MODELS.map(({ key, ...model }) => (
        <Model key={key} {...model} />
      ))}
    </group>
  )
}

function Model({ path, ...props }: ModelProps) {
  const { scene } = useGLTF(path)

  useLayoutEffect(() => {
    scene.traverse((o) => (o.castShadow = o.receiveShadow = true))
  }, [scene])

  return <primitive object={scene} {...props} />
}
