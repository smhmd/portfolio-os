import { createContext, useContext } from 'react'

import type TMatter from 'matter-js'
import type { Spritesheet } from 'pixi.js'

import { ensureContext } from 'app/utils'

export interface GameContextType {
  width: number
  height: number
  scaleFactor: number
  centerX: number
  centerY: number
  crosshair: TMatter.Vector
  spritesheet?: Spritesheet
}

export const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)
  ensureContext(context)
  return context
}
