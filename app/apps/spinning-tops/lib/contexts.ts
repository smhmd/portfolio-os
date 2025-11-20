import type TMatter from 'matter-js'
import type { Spritesheet } from 'pixi.js'

import { createCtx } from 'app/utils'

export interface GameContextType {
  width: number
  height: number
  scaleFactor: number
  centerX: number
  centerY: number
  crosshair: TMatter.Vector
  spritesheet?: Spritesheet
}

export const [GameContext, useGame] = createCtx<GameContextType>()
