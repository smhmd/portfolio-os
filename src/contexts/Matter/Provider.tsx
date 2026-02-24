import React, { useEffect, useMemo, useRef } from 'react'

import type TMatter from 'matter-js'
import Matter from 'matter-js'

import { MatterContext, type MatterContextType } from './context'

interface MatterProviderProps {
  children?: React.ReactNode
  options: TMatter.IEngineDefinition
}

const { Engine, Composite, Events } = Matter

export const MatterProvider = ({ children, options }: MatterProviderProps) => {
  const engineRef = useRef(Engine.create(options))

  useEffect(() => {
    return () => {
      Composite.clear(engineRef.current.world, false)
      Engine.clear(engineRef.current)
    }
  }, [])

  const value = useMemo<MatterContextType>(
    () => ({
      engine: engineRef.current,
      updateEngine: (delta) => Engine.update(engineRef.current, delta, 1),
      addBody: (object) => Composite.add(engineRef.current.world, object),
      removeBody: (object) => Composite.remove(engineRef.current.world, object),
      addEngineEvent: (name, callback) =>
        // @ts-expect-error we extracted the type ourselves
        Events.on(engineRef.current, name, callback),
      removeEngineEvent: (name) => Events.off(engineRef.current, name),
    }),
    [],
  )

  return (
    <MatterContext.Provider value={value}>{children}</MatterContext.Provider>
  )
}
