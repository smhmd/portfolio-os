import type TMatter from 'matter-js'
import Matter from 'matter-js'
import type { AnimatedSprite, Container, Sprite } from 'pixi.js'

import {
  ADDED_FORCE_SCALE,
  MOVEMENT_FORCE_SCALE,
  OUTER_CIRCLE_RADIUS,
  type PlayerID,
} from './common'

const { Vector, Body } = Matter

export function fadeObjectOut(
  object: Container | Sprite | AnimatedSprite,
  rate: number,
) {
  if (object.visible) {
    object.alpha -= rate

    if (object.alpha <= 0) {
      object.visible = false
      object.alpha = 1
      return true
    }
  }
}

export function applyMovementForce(body: TMatter.Body, target: TMatter.Vector) {
  const direction = Vector.sub(body.position, target)
  const normal = Vector.normalise(direction)
  const speed = Math.min(Vector.magnitudeSquared(direction), 10)
  const force = Vector.mult(normal, -MOVEMENT_FORCE_SCALE * speed)

  Body.applyForce(body, body.position, force)
}

export function applyAddedForce({ bodyA, bodyB, collision }: TMatter.Pair) {
  collision.supports.forEach((point) => {
    if (!point) return

    const speed = Vector.magnitude(Vector.sub(bodyB.velocity, bodyA.velocity))
    const force = Vector.mult(collision.normal, ADDED_FORCE_SCALE * speed)

    Body.applyForce(bodyA, point, force)
    Body.applyForce(bodyB, point, Vector.neg(force))
  })
}

/**
 * Game rule: a top is eliminated the moment it leaves the arena.
 * Returns the first body found outside it, or null. Deciding WHO is
 * eliminated is the battle layer's job (the host's alone, online) —
 * <Top> merely presents the outcome.
 */
export function findEliminated(
  bodies: Record<PlayerID, TMatter.Body>,
): PlayerID | null {
  for (const id of Object.keys(bodies) as PlayerID[]) {
    if (Vector.magnitude(bodies[id].position) >= OUTER_CIRCLE_RADIUS) return id
  }

  return null
}
