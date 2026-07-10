import type { RapierRigidBody } from '@react-three/rapier'
import { Quaternion, type Vector3 } from 'three'

import { rand } from 'src/lib/math'
import { uuid } from 'src/lib/utils'

import { type Variant, ZOOM } from './common'

export type DieData = {
  id: string
  variant: Variant
  position: [number, number, number]
  linearVelocity: [number, number, number]
  angularVelocity: [number, number, number]
}

export function createDie(variant: Variant): DieData {
  return {
    id: uuid(),
    variant,
    position: [rand(1), ZOOM * 0.7 + rand(1), rand(1)],
    linearVelocity: [rand(6), 12 + rand(6), rand(6)],
    angularVelocity: [
      rand(6, -6, 'ease-in'),
      rand(5, 0, 'ease-out'),
      rand(6, -6, 'ease-in'),
    ],
  }
}

type GetFaceOptions = {
  body: RapierRigidBody
  normals: Vector3[]
  variant: number
}

export function getFace({ body, normals, variant }: GetFaceOptions) {
  const rotation = body.rotation()
  const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)

  let maxY = -Infinity
  let topFaceIndex = -1

  normals.forEach((normal, i) => {
    const worldNormal = normal.clone().applyQuaternion(quat)
    if (variant === 4) {
      worldNormal.negate()
    }

    if (worldNormal.y > maxY) {
      maxY = worldNormal.y
      topFaceIndex = i
    }
  })

  return topFaceIndex
}
