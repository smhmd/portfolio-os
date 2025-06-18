import { useRef } from 'react'

import { useTick } from '@pixi/react'
import { useSelector } from '@xstate/react'

import { useGlobalState, useMatter } from 'app/contexts'

import { actor, FREQUENCY, MAX_ACCUMULATED_FREQUENCY, useGame } from '../lib'
import { Arena, Battle, Crosshair } from '.'

export function Scene() {
  const { width, height, centerX, centerY, scaleFactor, spritesheet } =
    useGame()

  const { updateEngine } = useMatter()
  const { isAppDrawerOpen } = useGlobalState()
  const isBattling = useSelector(
    actor,
    (state) => state.matches('PLAYING') || state.matches('GAME_OVER'),
  )

  const accumulator = useRef(0)

  useTick(({ deltaMS }) => {
    if (isAppDrawerOpen.current) return
    accumulator.current += Math.min(deltaMS, MAX_ACCUMULATED_FREQUENCY)

    while (accumulator.current >= FREQUENCY) {
      updateEngine(FREQUENCY)

      accumulator.current -= FREQUENCY
    }
  })

  return (
    <>
      {spritesheet && (
        <pixiSprite
          texture={spritesheet.textures['backdrop']}
          width={width}
          height={height}
        />
      )}
      <pixiContainer x={centerX} y={centerY} scale={scaleFactor}>
        <Arena />
        <Crosshair />
        {isBattling ? <Battle /> : null}
      </pixiContainer>
    </>
  )
}
