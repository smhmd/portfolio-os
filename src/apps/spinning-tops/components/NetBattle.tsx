import { useEffect, useRef } from 'react'

import { type PixiReactElementProps } from '@pixi/react'
import { useSelector } from '@xstate/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'

import { rand } from 'src/lib/math'

import {
  actor,
  addImpact,
  AIM_STEPS,
  applyAddedForce,
  applyMovementForce,
  type BodySnapshot,
  CORRECTION_RATE,
  eliminatedToWinner,
  findEliminated,
  MAX_MOVEMENT,
  net,
  NET_SPAWNS,
  PLAYER_BODY_DEF,
  PLAYER_RADIUS,
  type PlayerID,
  SELF_TINT,
  SNAP_DISTANCE,
  type Snapshot,
  SNAPSHOT_STEPS,
  useGame,
  useMatter,
} from '../lib'
import { SparksPool } from './SparksPool'
import { Top } from './Top'

const { Bodies, Body, Vector } = Matter

type Props = PixiReactElementProps

const IDS = ['p1', 'cpu'] as const

/**
 * PvP twin of <Battle>, deliberately kept separate so neither path has
 * to branch around the other.
 *
 * Both peers run the full simulation: the own top follows `crosshair`,
 * the opponent's follows `net.remoteAim`. The host is authoritative in
 * two ways:
 * - Continuously: its ~20 Hz snapshots softly pull the guest's bodies
 *   into line, so collisions, sparks and hit-stop all happen locally.
 * - Discretely: eliminations are the host's verdict alone, broadcast
 *   the moment they're detected. The guest never self-declares, so the
 *   two screens can never disagree about who won.
 *
 * Slots are fixed (host = 'p1', guest = 'cpu'), but each player sees
 * their own top in gold — identity, not slot, decides the color.
 */
export function NetBattle(props: Props) {
  const { crosshair } = useGame()
  const { addEngineEvent } = useMatter()
  const isHost = useSelector(actor, (state) => state.context.mode === 'host')

  const me: PlayerID = isHost ? 'p1' : 'cpu'
  const them: PlayerID = isHost ? 'cpu' : 'p1'

  // Same guard as <Battle>: if the pointer never moved, the crosshair
  // still sits at its far off-screen sentinel and would drag the own
  // top straight out of the arena. Pull it onto the own spawn instead.
  if (Vector.magnitude(crosshair) > MAX_MOVEMENT) {
    crosshair.x = NET_SPAWNS[me].x
    crosshair.y = NET_SPAWNS[me].y
  }

  const players = useRef({
    p1: Bodies.circle(
      NET_SPAWNS.p1.x,
      NET_SPAWNS.p1.y,
      PLAYER_RADIUS,
      PLAYER_BODY_DEF,
    ),
    cpu: Bodies.circle(
      NET_SPAWNS.cpu.x,
      NET_SPAWNS.cpu.y,
      PLAYER_RADIUS,
      PLAYER_BODY_DEF,
    ),
  })

  const eliminated = useRef<PlayerID | null>(null)
  const addedForceQueue = useRef<TMatter.Pair[]>([])
  const randomTarget = useRef(Vector.create(0, 0))
  const step = useRef(0)

  function moveRandomly(body: TMatter.Body) {
    randomTarget.current.x = rand(150)
    randomTarget.current.y = rand(150)
    applyMovementForce(body, randomTarget.current)
  }

  useEffect(() => {
    // Fresh round: drop anything left over from the previous one and
    // assume the opponent aims at their spawn until their first packet.
    net.snapshot = null
    net.remoteEliminated = null
    net.remoteAim.x = NET_SPAWNS[them].x
    net.remoteAim.y = NET_SPAWNS[them].y

    const offCollision = addEngineEvent('collisionStart', (event) => {
      for (const pair of event.pairs) {
        const { bodyA, bodyB } = pair
        if (bodyA.isStatic || bodyB.isStatic) continue

        addedForceQueue.current.push(pair)

        // juice: hit-stop + screen shake, scaled by impact energy
        const relativeSpeed = Vector.magnitude(
          Vector.sub(bodyB.velocity, bodyA.velocity),
        )
        addImpact(relativeSpeed / 12)
      }
    })

    const offUpdate = addEngineEvent('beforeUpdate', () => {
      const bodies = players.current
      step.current++

      // Guest: fold the latest authoritative snapshot in, then simulate
      // forward from it until the next one arrives.
      if (!isHost && net.snapshot) {
        applySnapshot(bodies, net.snapshot, eliminated.current)
        net.snapshot = null
      }

      // Elimination: the host detects and broadcasts; the guest obeys.
      if (!eliminated.current) {
        if (isHost) {
          const out = findEliminated(bodies)
          if (out) net.sendEliminated((eliminated.current = out))
        } else {
          eliminated.current = net.remoteEliminated
        }
      }

      if (eliminated.current) {
        // Match <Battle>: the winner roams to free up the cursor. The
        // host steers the roam; snapshots carry it over to the guest.
        const winner = eliminatedToWinner[eliminated.current]
        if (isHost) moveRandomly(bodies[winner])
      } else {
        applyMovementForce(bodies[me], crosshair)
        applyMovementForce(bodies[them], net.remoteAim)

        if (step.current % AIM_STEPS === 0) {
          net.sendAim([Math.round(crosshair.x), Math.round(crosshair.y)])
        }
      }

      while (addedForceQueue.current.length > 0) {
        applyAddedForce(addedForceQueue.current.shift()!)
      }

      if (isHost && step.current % SNAPSHOT_STEPS === 0) {
        net.sendState({ p1: pack(bodies.p1), cpu: pack(bodies.cpu) })
      }
    })

    return () => {
      offUpdate()
      offCollision()
    }
    // Handlers only reference stable refs; `isHost` is mount-constant
    // (mode only changes by leaving the room, which unmounts us).
  }, [])

  return (
    <pixiContainer label='NetBattle' {...props}>
      {IDS.map((id) => (
        <Top
          key={id}
          id={id}
          body={players.current[id]}
          tint={id === me ? SELF_TINT : 0xffffff}
          eliminated={eliminated}
        />
      ))}
      <SparksPool />
    </pixiContainer>
  )
}

function round(n: number) {
  return Math.round(n * 100) / 100
}

function pack({ position, velocity }: TMatter.Body): BodySnapshot {
  return [
    round(position.x),
    round(position.y),
    round(velocity.x),
    round(velocity.y),
  ]
}

function applySnapshot(
  bodies: Record<PlayerID, TMatter.Body>,
  snapshot: Snapshot,
  eliminated: PlayerID | null,
) {
  for (const id of IDS) {
    // An exiting body belongs to its exit animation — leave it be.
    if (id !== eliminated) correct(bodies[id], snapshot[id])
  }
}

function correct(body: TMatter.Body, [x, y, vx, vy]: BodySnapshot) {
  const target = { x, y }
  const error = Vector.sub(target, body.position)

  // Nudge toward the authoritative position; only teleport when the
  // simulations have drifted too far apart to hide it.
  const position =
    Vector.magnitude(error) > SNAP_DISTANCE
      ? target
      : Vector.add(body.position, Vector.mult(error, CORRECTION_RATE))

  Body.setPosition(body, position)
  Body.setVelocity(body, { x: vx, y: vy })
}
