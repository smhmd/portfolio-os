import { createContext, useContext } from 'react'

import type TMatter from 'matter-js'

type EngineEventMap = {
  afterUpdate: TMatter.IEngineCallback
  beforeUpdate: TMatter.IEngineCallback
  collisionActive: TMatter.ICollisionCallback
  collisionEnd: TMatter.ICollisionCallback
  collisionStart: TMatter.ICollisionCallback
}

export interface MatterContextType {
  engine: TMatter.Engine
  updateEngine: (delta: number) => void
  addBody: (object: TMatter.Body) => void
  removeBody: (object: TMatter.Body) => void
  addEngineEvent: <K extends keyof EngineEventMap>(
    name: K,
    callback: EngineEventMap[K],
  ) => void
  removeEngineEvent: <K extends keyof EngineEventMap>(name: K) => void
}

export const MatterContext = createContext<MatterContextType | undefined>(
  undefined,
)

export const useMatter = () => {
  const context = useContext(MatterContext)
  if (!context) {
    throw new Error('useMatter must be used within a MatterProvider')
  }
  return context
}
