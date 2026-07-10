import { memo, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { type RapierRigidBody, RigidBody } from '@react-three/rapier'
import { Vector3 } from 'three'

import { magnitude } from 'src/lib/math'

import { getFace, type Variant } from '../lib'
import { variants } from '../lib/models'

type DieProps = {
  id: string
  variant: Variant
  position: [number, number, number]
  linearVelocity: [number, number, number]
  angularVelocity: [number, number, number]
  onSettle(id: string, value: number, x: number, y: number): void
  onRemove(id: string): void
}

const STILLNESS_THRESHOLD = 0.05
const STABLE_FRAMES = 15

const projection = new Vector3() // shared; useFrame callbacks never overlap

export const Die = memo(
  ({
    id,
    variant,
    position,
    linearVelocity,
    angularVelocity,
    onSettle,
    onRemove,
  }: DieProps) => {
    const {
      geometry,
      normals,
      materials,
      colliders = 'hull',
    } = variants[variant]

    const bodyRef = useRef<RapierRigidBody>(null)
    const stableFrames = useRef(0)
    const reported = useRef<number | null>(null) // emit only when the value changes

    useFrame(({ camera, size }) => {
      const body = bodyRef.current
      if (!body) return

      const still =
        magnitude(body.linvel()) < STILLNESS_THRESHOLD &&
        magnitude(body.angvel()) < STILLNESS_THRESHOLD

      if (!still) {
        stableFrames.current = 0
        return
      }

      // Fire once per landing; re-fires only if knocked loose and re-settled.
      if (++stableFrames.current !== STABLE_FRAMES) return

      const face = getFace({ body, normals, variant })
      if (face === -1) return

      const value = variant === 100 ? face * 10 : face + 1
      if (value === reported.current) return
      reported.current = value

      const t = body.translation()
      projection.set(t.x, t.y, t.z).project(camera) // TODO: why are we doing this again?
      onSettle(
        id,
        value,
        (projection.x * 0.5 + 0.5) * size.width,
        (-projection.y * 0.5 + 0.5) * size.height,
      )
    })

    return (
      <RigidBody
        ref={bodyRef}
        position={position}
        ccd
        linearVelocity={linearVelocity}
        angularVelocity={angularVelocity}
        gravityScale={2.5}
        restitution={0.3}
        friction={0.6}
        linearDamping={1}
        angularDamping={0.4}
        colliders={colliders}>
        <mesh
          onClick={() => onRemove(id)}
          frustumCulled={false}
          geometry={geometry}
          material={materials}
          castShadow
          receiveShadow
        />
      </RigidBody>
    )
  },
)

Die.displayName = 'Die'
