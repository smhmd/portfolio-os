import type { RapierRigidBody } from '@react-three/rapier'
import { Quaternion, type Vector3 } from 'three'

function toRGB(c: number) {
  return Math.ceil(c * 255)
}

export function colorLog(
  color: string | { r: number; g: number; b: number },
  value: unknown,
) {
  const cssColor =
    typeof color === 'string'
      ? color
      : `rgb( ${toRGB(color.r)}, ${toRGB(color.g)}, ${toRGB(color.b)})`

  console.log(`%c${value}`, `color: ${cssColor}`)
}

type GetFaceOptions = {
  body: RapierRigidBody
  normals: Vector3[]
  variant: number
}

export function getFace({ body, normals, variant }: GetFaceOptions) {
  const rotation = body.rotation()
  const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)

  let maxY = 0
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
