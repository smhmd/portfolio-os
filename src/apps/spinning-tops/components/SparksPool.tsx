import { useEffect, useRef } from 'react'

import { useTick } from '@pixi/react'
import Matter from 'matter-js'
import type { AnimatedSprite } from 'pixi.js'

import { rand } from 'src/lib/math'

import {
  FREQUENCY,
  SPARK_BOUNDARY_SCALAR,
  SPARK_PLAYER_SCALAR,
  SPARK_POOL_BIG,
  SPARK_POOL_SMALL,
  sparkVariants,
  useMatter,
} from '../lib'
import { Spark } from './Spark'

const { Vector } = Matter

type SparkType = 'small' | 'big'

type Slot = {
  sprite: AnimatedSprite | null
  active: boolean
  vx: number
  vy: number
}

type Pool = {
  slots: Slot[]
  free: number[]
}

function createPool(size: number): Pool {
  return {
    slots: Array.from({ length: size }, () => ({
      sprite: null,
      active: false,
      vx: 0,
      vy: 0,
    })),
    free: Array.from({ length: size }, (_, i) => i),
  }
}

function computeVelocity(delta: Matter.Vector, velocityScale: number) {
  const perp = Vector.perp(delta, true)
  const decay = rand(0.9, 0.4)
  return {
    vx: rand(5) - velocityScale * perp.x * decay,
    vy: rand(5) - velocityScale * perp.y * decay,
  }
}

export function SparksPool() {
  const { addEngineEvent } = useMatter()

  const poolsRef = useRef({
    small: createPool(SPARK_POOL_SMALL),
    big: createPool(SPARK_POOL_BIG),
  })

  function activateSpark(
    type: SparkType,
    position: Matter.Vector,
    delta: Matter.Vector,
  ) {
    const pool = poolsRef.current[type]

    // `pop()` legitimately returns index 0 — `!index` treated slot 0 as
    // "pool exhausted" and leaked it permanently. Compare with undefined.
    const index = pool.free.pop()
    if (index === undefined) return

    const slot = pool.slots[index]
    const sprite = slot.sprite

    // Refs attach after commit; a collision can fire before the sprite
    // exists (or after it unmounted). Return the slot instead of crashing.
    if (!sprite) {
      pool.free.push(index)
      return
    }

    const { velocityScale, baseRotation } = sparkVariants[type]
    const { vx, vy } = computeVelocity(delta, velocityScale)

    Object.assign(slot, { vx, vy, active: true })

    sprite.position.set(position.x, position.y)
    sprite.rotation = baseRotation + Math.atan2(delta.y, delta.x)
    sprite.visible = true
    sprite.gotoAndPlay(0)
  }

  function activateSparks(
    position: Matter.Vector,
    delta: Matter.Vector,
    small = 0,
    big = 0,
    reverse = false,
  ) {
    const directions = reverse ? [delta, Matter.Vector.neg(delta)] : [delta]

    for (const d of directions) {
      for (let i = 0; i < small; i++) activateSpark('small', position, d)
      for (let i = 0; i < big; i++) activateSpark('big', position, d)
    }
  }

  function deactivateSpark(type: SparkType, index: number) {
    const pool = poolsRef.current[type]
    const slot = pool.slots[index]

    // Guard against double-free pushing a duplicate index into `free`.
    if (!slot.active) return

    slot.active = false
    pool.free.push(index)

    if (slot.sprite) slot.sprite.visible = false
  }

  useEffect(() => {
    return addEngineEvent('collisionStart', (event) => {
      for (const { bodyA, bodyB, collision } of event.pairs) {
        // the wall, if collided with
        const boundary = bodyA.isStatic ? bodyA : bodyB.isStatic ? bodyB : null

        const delta =
          boundary?.position ?? Vector.sub(bodyB.position, bodyA.position)

        const scaled = Vector.mult(
          delta,
          boundary ? SPARK_BOUNDARY_SCALAR : SPARK_PLAYER_SCALAR,
        )

        collision.supports.filter(Boolean).forEach((position) => {
          activateSparks(position, scaled, 4, 2, !boundary)
        })
      }
    })
  }, [])

  useTick(({ deltaMS }) => {
    const correction = deltaMS / FREQUENCY

    for (const { slots } of Object.values(poolsRef.current)) {
      slots.forEach((slot) => {
        if (!slot.active || !slot.sprite) return

        slot.sprite.position.x += slot.vx * correction
        slot.sprite.position.y += slot.vy * correction
      })
    }
  })

  return (['small', 'big'] as const).flatMap((type) =>
    poolsRef.current[type].slots.map((slot, i) => (
      <Spark
        key={'spark-' + type + i}
        type={type}
        ref={(el) => {
          slot.sprite = el
        }}
        onComplete={() => deactivateSpark(type, i)}
      />
    )),
  )
}
