import type { RapierRigidBody } from '@react-three/rapier'
import { Quaternion, type Vector3 } from 'three'

function getInwardImpulse(
  pos: { x: number; y: number; z: number },
  mass: number,
) {
  return {
    x: (-pos.x + (Math.random() - 0.1)) * mass,
    y: (2 - pos.y + (Math.random() - 0.2)) * mass,
    z: (-pos.z + (Math.random() - 0.1)) * mass,
  }
}

export function jump(body: RapierRigidBody) {
  const mass = body.mass()
  const pos = body.translation()
  body.applyImpulse(getInwardImpulse(pos, mass), true)

  body.applyTorqueImpulse(
    {
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    },
    true,
  )
}

export function colorLog(color: string, value: unknown) {
  console.log(`%c${value}`, `color: ${color}`)
}

export function getFace({
  body,
  normals,
  variant,
}: {
  body: RapierRigidBody
  normals: Vector3[]
  variant: number
}) {
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

export function roll(body: RapierRigidBody) {
  const mass = body.mass()

  const direction = Math.random() > 0.5 ? 1 : -1

  const impulse = {
    x: mass * direction * Math.random() * 12,
    y: mass * Math.random() * 2,
    z: mass * direction * Math.random() * 12,
  }

  const torque = {
    x: Math.random() - 0.5,
    y: Math.random() - 0.5,
    z: Math.random() - 0.5,
  }
  body.applyImpulse(impulse, true)

  body.applyTorqueImpulse(torque, true)
}
