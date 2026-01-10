import type TMatter from 'matter-js'

import { PI } from 'app/lib'

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

export const difficulties = ['easy', 'medium', 'hard']

export type PlayerID = 'me' | 'cpu'

export type CollisionPoint = {
  id: string
  type: 'small' | 'big'
  position: TMatter.Vector
  delta: TMatter.Vector
}

export type State = {
  difficulty: number
  winner: PlayerID | null
}
