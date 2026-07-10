import type TMatter from 'matter-js'
import type { Spritesheet } from 'pixi.js'

import { createCtx } from 'src/lib/react'

export interface GameContextType {
  width: number
  height: number
  scaleFactor: number
  centerX: number
  centerY: number
  crosshair: TMatter.Vector
  spritesheet?: Spritesheet
}

type EngineEventMap = {
  afterUpdate: TMatter.IEngineCallback
  beforeUpdate: TMatter.IEngineCallback
  collisionActive: TMatter.ICollisionCallback
  collisionEnd: TMatter.ICollisionCallback
  collisionStart: TMatter.ICollisionCallback
}

export type Unsubscribe = () => void

export interface MatterContextType {
  engine: TMatter.Engine
  updateEngine(delta: number): void
  addBody(object: TMatter.Body): void
  removeBody(object: TMatter.Body): void
  addEngineEvent: <K extends keyof EngineEventMap>(
    name: K,
    callback: EngineEventMap[K],
  ) => Unsubscribe
}

export const [GameContext, useGame] = createCtx<GameContextType>()
export const [MatterContext, useMatter] = createCtx<MatterContextType>()
