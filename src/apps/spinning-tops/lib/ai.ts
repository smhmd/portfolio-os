import type TMatter from 'matter-js'
import Matter from 'matter-js'

import { OUTER_CIRCLE_RADIUS, PLAYER_RADIUS } from './common'
import { applyMovementForce } from './utils'

const { Vector } = Matter

type AIStrategy = (
  cpuBody: TMatter.Body,
  playerPosition: TMatter.Vector,
) => void

const RED_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS
const YELLOW_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS * 1
const GREEN_ZONE = OUTER_CIRCLE_RADIUS - PLAYER_RADIUS * 2

export const aiStrategies: Record<number, AIStrategy> = {
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
