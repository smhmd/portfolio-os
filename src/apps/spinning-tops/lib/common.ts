import type TMatter from 'matter-js'

import { PI } from 'src/lib/math'

export const APP_ID = 'spinning-tops'

export const FREQUENCY = 1000 / 60
export const MAX_ACCUMULATED_FREQUENCY = 100

export const MAX_MOVEMENT = 400

export const OUTER_CIRCLE_RADIUS = 490

export const BARRIER_COUNT = 3
export const BARRIER_RADIUS = OUTER_CIRCLE_RADIUS + 14
export const BARRIER_ANGLE = PI / BARRIER_COUNT

export const MOVEMENT_FORCE_SCALE = 14 / 10000
export const ADDED_FORCE_SCALE = 8 / 1000

export const PLAYER_RADIUS = 40
export const PLAYER_BODY_DEF = {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
} satisfies TMatter.IBodyDefinition

/** The viewer's own top is always gold, on every screen. */
export const SELF_TINT = 0xffd87b

export const difficulties = ['easy', 'medium', 'hard']

export const SPARK_POOL_SMALL = 60
export const SPARK_POOL_BIG = 20
export const SPARK_BOUNDARY_SCALAR = 9 / 100
export const SPARK_PLAYER_SCALAR = 5 / 10

export const sparkVariants = {
  small: {
    velocityScale: 0.5,
    anchor: 0.5,
    baseRotation: 0,
    animationSpeed: 2,
  },
  big: {
    velocityScale: 0.2,
    anchor: { x: 0.5, y: 0.6 },
    baseRotation: PI,
    animationSpeed: 1,
  },
} as const

export type PlayerID = 'p1' | 'cpu'

export type Mode = 'local' | 'host' | 'guest'

export type State = {
  difficulty: number
  winner: PlayerID | null
  mode: Mode
  roomCode: string | null
  /** True while the opponent's tab is hidden — the match pauses. */
  friendPaused: boolean
}

export const eliminatedToWinner = {
  p1: 'cpu',
  cpu: 'p1',
} as const

/**
 * Networking (PvP). The host owns the 'p1' slot, the guest owns 'cpu'
 * (the second slot — kept as-is to avoid a rename rippling through the
 * codebase).
 */
export const NET_APP_ID = 'spinning-tops-p2p'

export const SNAPSHOT_STEPS = 3 // host → guest state every 3rd physics step (~20 Hz)
export const AIM_STEPS = 2 // own aim every 2nd physics step (~30 Hz)

export const CORRECTION_RATE = 0.3 // fraction of position error corrected per snapshot
export const SNAP_DISTANCE = 150 // beyond this error, teleport instead of nudging

export const NET_SPAWNS = {
  p1: { x: 0, y: 200 },
  cpu: { x: 0, y: -200 },
} satisfies Record<PlayerID, TMatter.Vector>
