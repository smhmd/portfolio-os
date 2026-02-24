import { useCallback, useEffect, useRef, useState } from 'react'

import { useSelector } from '@xstate/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'

import { useMatter } from 'src/contexts'
import { uuid } from 'src/utils'

import {
  actor,
  applyAddedForce,
  applyMovementForce,
  type CollisionPoint,
  OUTER_CIRCLE_RADIUS,
  PLAYER_RADIUS,
  useGame,
} from '../lib'
import { Spark, Top } from '.'

const { Bodies, Vector } = Matter

const AI_ENABLED = true

const PLAYER_BODY_DEF = {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
} satisfies TMatter.IBodyDefinition

const SPARK_BOUNDARY_SCALAR = 9 / 100
const SPARK_PLAYER_SCALAR = 5 / 10

const RED_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS
const YELLOW_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS * 1
const GREEN_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS * 2

const computerAI: Record<
  number,
  (cpuBody: TMatter.Body, playerPosition: TMatter.Vector) => void
> = {
  0: (cpuBody, playerPosition) => {
    applyMovementForce(cpuBody, playerPosition)
  },
  1: (cpuBody, playerPosition) => {
    const playerMag = Vector.magnitude(playerPosition)
    const cpuMag = Vector.magnitude(cpuBody.position)

    let target = playerPosition

    if (cpuMag >= YELLOW_ZONE) target = Vector.neg(playerPosition)
    if (playerMag >= RED_ZONE) target = playerPosition

    applyMovementForce(cpuBody, target)
  },
  2: (cpuBody, playerPosition) => {
    const playerMag = Vector.magnitude(playerPosition)
    const cpuMag = Vector.magnitude(cpuBody.position)

    let target = playerPosition

    if (cpuMag >= GREEN_ZONE) target = Vector.neg(playerPosition)
    if (playerMag >= RED_ZONE) target = playerPosition

    applyMovementForce(cpuBody, target)
  },
}

export function Battle() {
  const { centerX, centerY, scaleFactor, crosshair } = useGame()
  const { addBody, addEngineEvent, removeEngineEvent } = useMatter()
  const difficulty = useSelector(actor, (state) => state.context.difficulty)

  const me = useRef(
    Bodies.circle(crosshair.x, crosshair.y, PLAYER_RADIUS, PLAYER_BODY_DEF),
  )
  const cpu = useRef(Bodies.circle(0, 0, PLAYER_RADIUS, PLAYER_BODY_DEF))

  useEffect(() => {
    addBody(me.current)
    addBody(cpu.current)
  }, [])

  const addedForceQueue = useRef<TMatter.Pair[]>([])

  const [sparks, setSparks] = useState<CollisionPoint[]>([])

  function addSpark({
    delta,
    position,
  }: Pick<CollisionPoint, 'position' | 'delta'>) {
    const small = Array.from({ length: 4 }, () => ({
      id: uuid(),
      type: 'small' as const,
      delta,
      position,
    }))

    const big = Array.from({ length: 2 }, () => ({
      id: uuid(),
      type: 'big' as const,
      delta,
      position,
    }))

    setSparks((s) => [...s, ...small, ...big])
  }

  function removeSpark(id: string) {
    setSparks((s) => s.filter((spark) => spark.id !== id))
  }

  const moveComputer = useCallback(computerAI[difficulty], [])

  useEffect(() => {
    addEngineEvent('collisionStart', (event) => {
      for (const pair of event.pairs) {
        const { bodyA, bodyB, collision } = pair

        if (bodyA.isStatic || bodyB.isStatic) {
          const player = bodyA.isStatic ? bodyB : bodyA

          const delta = Vector.mult(player.position, SPARK_BOUNDARY_SCALAR)

          collision.supports.forEach((position) => {
            if (position) {
              addSpark({ delta, position })
            }
          })
        } else {
          const delta = Vector.mult(
            Vector.sub(bodyB.position, bodyA.position),
            SPARK_PLAYER_SCALAR,
          )

          collision.supports.forEach((position) => {
            if (position) {
              addSpark({ delta, position })
              addSpark({ delta: Vector.neg(delta), position })
            }
          })

          addedForceQueue.current.push(pair)
        }
      }
    })

    addEngineEvent('beforeUpdate', () => {
      applyMovementForce(me.current, crosshair)

      if (AI_ENABLED) {
        moveComputer(cpu.current, me.current.position)
      }

      while (addedForceQueue.current.length > 0) {
        const pair = addedForceQueue.current.shift()!
        applyAddedForce(pair)
      }
    })

    return () => {
      removeEngineEvent('beforeUpdate')
      removeEngineEvent('collisionStart')
    }
  }, [centerX, centerY, scaleFactor])

  return (
    <>
      <Top id='me' body={me.current} tint={0xffd87b} />
      <Top id='cpu' body={cpu.current} />

      {sparks.map((spark) => (
        <Spark
          key={spark.id}
          onComplete={() => removeSpark(spark.id)}
          {...spark}
        />
      ))}
    </>
  )
}
