import React, { use, useEffect, useMemo, useRef } from 'react'

import type TMatter from 'matter-js'
import Matter from 'matter-js'
import { Assets, Spritesheet } from 'pixi.js'

import { useGlobals } from 'src/contexts'
import { clientOnlyPromise } from 'src/lib/ssr'

import { GameContext, MatterContext, type MatterContextType } from '../lib'

const { Vector } = Matter

const spritesheetPromise = clientOnlyPromise(() =>
  Assets.load<Spritesheet>('/images/spinning-tops.json'),
)

export const GameProvider = ({ children }: React.PropsWithChildren) => {
  const spritesheet = use(spritesheetPromise)!

  const crosshair = useRef(Vector.create(99999, 99999)) // start outside of the screen

  const { width, height } = useGlobals()

  const value = useMemo(
    () => ({
      width,
      height,
      scaleFactor: Math.min(width, height) / 1010,
      centerX: width / 2,
      centerY: height / 2,
      crosshair: crosshair.current,
      spritesheet,
    }),
    [width, height, spritesheet],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

interface MatterProviderProps {
  children?: React.ReactNode
  options: TMatter.IEngineDefinition
}

const { Engine, Composite, Events } = Matter

export const MatterProvider = ({ children, options }: MatterProviderProps) => {
  const engineRef = useRef<TMatter.Engine | null>(null)
  engineRef.current ??= Engine.create(options)
  const engine = engineRef.current

  useEffect(() => {
    return () => {
      Composite.clear(engine.world, false)
      Engine.clear(engine)
    }
  }, [])

  const value = useMemo<MatterContextType>(
    () => ({
      engine,
      updateEngine: (delta) => Engine.update(engine, delta, 1),
      addBody: (object) => Composite.add(engine.world, object),
      removeBody: (object) => Composite.remove(engine.world, object),
      addEngineEvent: (name, callback) => {
        // @ts-expect-error we extracted the type ourselves
        Events.on(engine, name, callback)
        // Return an unsubscribe that removes only this callback.
        // `Events.off(engine, name)` (no callback) removes ALL handlers
        // for that event, which clobbered other components' handlers.
        return () => Events.off(engine, name, callback)
      },
    }),
    [],
  )

  return (
    <MatterContext.Provider value={value}>{children}</MatterContext.Provider>
  )
}
