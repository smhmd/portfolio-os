import { useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import {
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import { type Mesh } from 'three'

import { magnitude } from 'src/utils'

import { colorLog, getFace, type Variant } from '../lib'
import { variants } from '../lib/models'

type DieProps = {
  variant: Variant
  onClick?(id: string): void
} & RigidBodyProps

const STILLNESS_THRESHOLD = 0.05

export function Die({ variant, ...props }: DieProps) {
  const { geometry, normals, materials, colliders = 'hull' } = variants[variant]

  const bodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<Mesh>(null)

  const stableFrames = useRef(0)

  useFrame(() => {
    const body = bodyRef.current
    if (!body) return

    const linvel = body.linvel()
    const angvel = body.angvel()

    const speed = magnitude(linvel)
    const rotation = magnitude(angvel)

    const isStill =
      speed < STILLNESS_THRESHOLD && rotation < STILLNESS_THRESHOLD

    if (isStill) {
      stableFrames.current++
      const isStable = stableFrames.current === 15

      if (isStable) {
        const topFaceIndex = getFace({
          body,
          normals,
          variant,
        })
        if (topFaceIndex !== -1) {
          const value = [10, 100].includes(variant)
            ? topFaceIndex
            : topFaceIndex + 1

          colorLog(materials[0].color, `D${variant}: ${value}`)
        }
      }
    } else {
      stableFrames.current = 0
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      gravityScale={2.5}
      restitution={0.4}
      friction={0.5}
      linearDamping={1.2}
      angularDamping={1.15}
      colliders={colliders}
      {...props}>
      <mesh
        frustumCulled={false}
        ref={meshRef}
        geometry={geometry}
        material={materials}
        castShadow
        receiveShadow
      />
    </RigidBody>
  )
}
