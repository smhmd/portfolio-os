import React, { use, useMemo, useRef } from 'react'

import Matter from 'matter-js'
import { Assets, Spritesheet } from 'pixi.js'

import { useGlobals } from 'app/contexts'
import { clientOnlyPromise } from 'app/lib'

import { GameContext } from '../lib'

const { Vector } = Matter

const spritesheetPromise = clientOnlyPromise(() =>
  Assets.load<Spritesheet>('/spinning-tops/sprite.json'),
)

export const GameProvider = ({ children }: React.PropsWithChildren) => {
  const spritesheet = use(spritesheetPromise)!

  const crosshair = useRef(Vector.create(99999, 99999)) // start outside of the screen

  const { width, height } = useGlobals()

  const { scaleFactor, centerX, centerY } = useMemo(
    () => ({
      scaleFactor: Math.min(width, height) / 1010,
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
