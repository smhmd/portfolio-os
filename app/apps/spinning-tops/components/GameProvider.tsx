import React, { useEffect, useMemo, useRef, useState } from 'react'

import Matter from 'matter-js'
import { Assets, Spritesheet } from 'pixi.js'

import { useAsync } from 'app/hooks'

import { GameContext } from '../lib'

const { Vector } = Matter

interface GameProviderProps {
  children?: React.ReactNode
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const { data: spritesheet } = useAsync(async () =>
    Assets.load<Spritesheet>('/sprites/spinning-tops.json'),
  )

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
      scaleFactor: 0.00098 * Math.min(width, height),
      centerX: width / 2,
      centerY: height / 2,
    }),
    [width, height],
  )

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
