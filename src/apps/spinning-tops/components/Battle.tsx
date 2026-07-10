import { useEffect, useRef } from 'react'

import { type PixiReactElementProps } from '@pixi/react'
import { useSelector } from '@xstate/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'

import { rand } from 'src/lib/math'

import {
  actor,
  addImpact,
  aiStrategies,
  applyAddedForce,
  applyMovementForce,
  eliminatedToWinner,
  findEliminated,
  MAX_MOVEMENT,
  PLAYER_BODY_DEF,
  PLAYER_RADIUS,
  type PlayerID,
  SELF_TINT,
  useGame,
  useMatter,
} from '../lib'
import { SparksPool } from './SparksPool'
import { Top } from './Top'

const { Bodies, Vector } = Matter

type Props = PixiReactElementProps

const INTRO_DURATION = 3000

/** Default p1 spawn when the pointer has never entered the arena. */
const DEFAULT_SPAWN = { x: 0, y: 200 }

export function Battle(props: Props) {
  const { crosshair } = useGame()
  const { addEngineEvent } = useMatter()
  // Note: the default comparator (Object.is) is correct here. Passing
  // `(a, b) => a !== b` inverted the equality check and would have frozen
  // the selected value on the first change.
  const difficulty = useSelector(actor, (state) => state.context.difficulty)

  // The crosshair starts at a far off-screen sentinel and is only clamped
  // inside `pointermove`. If the game is started via keyboard or touch
  // without the pointer ever moving, p1 would spawn (and be dragged)
  // outside the arena and instantly lose. Clamp it before creating bodies.
  if (Vector.magnitude(crosshair) > MAX_MOVEMENT) {
    crosshair.x = DEFAULT_SPAWN.x
    crosshair.y = DEFAULT_SPAWN.y
  }

  const players = useRef({
    p1: Bodies.circle(crosshair.x, crosshair.y, PLAYER_RADIUS, PLAYER_BODY_DEF),
    cpu: Bodies.circle(0, 0, PLAYER_RADIUS, PLAYER_BODY_DEF),
  })

  const startTime = useRef<number | null>(null)
  const eliminated = useRef<PlayerID | null>(null)
  const addedForceQueue = useRef<TMatter.Pair[]>([])
  const randomTarget = useRef(Vector.create(0, 0))

  const moveCPU = aiStrategies[difficulty]

  function moveRandomly(body: TMatter.Body) {
    randomTarget.current.x = rand(150)
    randomTarget.current.y = rand(150)
    applyMovementForce(body, randomTarget.current)
  }

  useEffect(() => {
    const offCollision = addEngineEvent('collisionStart', (event) => {
      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair
        const isWall = bodyA.isStatic || bodyB.isStatic

        if (!isWall) {
          addedForceQueue.current.push(pair)

          // juice: hit-stop + screen shake, scaled by impact energy
          const relativeSpeed = Vector.magnitude(
            Vector.sub(bodyB.velocity, bodyA.velocity),
          )
          addImpact(relativeSpeed / 12)
        }
      }
    })

    const offUpdate = addEngineEvent('beforeUpdate', (event) => {
      // The battle decides eliminations; <Top> just presents them.
      eliminated.current ??= findEliminated(players.current)

      if (eliminated.current) {
        const winner = eliminatedToWinner[eliminated.current]
        return moveRandomly(players.current[winner])
      }

      const { p1, cpu } = players.current

      applyMovementForce(p1, crosshair)

      if (startTime.current === null) startTime.current = event.timestamp

      if (event.timestamp - startTime.current < INTRO_DURATION) {
        moveRandomly(cpu)
      } else moveCPU(cpu, p1.position)

      while (addedForceQueue.current.length > 0) {
        const pair = addedForceQueue.current.shift()!
        applyAddedForce(pair)
      }
    })

    return () => {
      offUpdate()
      offCollision()
    }
    // Handlers only reference stable refs and the (mount-constant)
    // difficulty strategy. Re-registering on resize previously risked
    // clobbering other components' handlers and restarting the intro.
  }, [])

  return (
    <pixiContainer label='Battle' {...props}>
      <Top
        id='p1'
        body={players.current.p1}
        tint={SELF_TINT}
        eliminated={eliminated}
      />
      <Top id='cpu' body={players.current.cpu} eliminated={eliminated} />
      <SparksPool />
    </pixiContainer>
  )
}
