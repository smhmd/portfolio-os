import React, { use, useEffect, useMemo, useRef, useState } from 'react'

import Matter from 'matter-js'
import { Assets, Spritesheet } from 'pixi.js'

import { GameContext } from '../lib'
import { createClientPromise } from '~/lib'

const { Vector } = Matter

interface GameProviderProps {
  children?: React.ReactNode
}

const spritesheetPromise = createClientPromise(
  Assets.load<Spritesheet>('/spinning-tops/sprite.json'),
)

export const GameProvider = ({ children }: GameProviderProps) => {
  const spritesheet = use(spritesheetPromise)

  const crosshair = useRef(Vector.create(99999, 99999)) // start outside of the screen

  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const controller = new AbortController()

    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()

    window.addEventListener('resize', handleResize, {
      signal: controller.signal,
    })
    window.addEventListener('orientationchange', handleResize, {
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [])

  const { scaleFactor, centerX, centerY } = useMemo(
    () => ({
      scaleFactor: Math.min(width, height) / 1010,
      centerX: width / 2,
      centerY: height / 2,
    }),
    [width, height],
  )

  if (!spritesheet) return null

  const value = {
    width,
    height,
    scaleFactor,
    centerX,
    centerY,
    crosshair: crosshair.current,
    spritesheet,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
