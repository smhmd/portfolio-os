import { useRef } from 'react'

import { useTick } from '@pixi/react'
import { useSelector } from '@xstate/react'
import type { Container } from 'pixi.js'

import { useGlobals } from 'src/contexts'
import { rand } from 'src/lib/math'

import {
  actor,
  FREQUENCY,
  MAX_ACCUMULATED_FREQUENCY,
  useGame,
  useMatter,
  vfx,
} from '../lib'
import { Arena } from './Arena'
import { Battle } from './Battle'
import { Crosshair } from './Crosshair'
import { NetBattle } from './NetBattle'

export function Scene() {
  const { width, height, centerX, centerY, scaleFactor, spritesheet } =
    useGame()

  const { updateEngine } = useMatter()
  const { isAppDrawerOpen, isReducedMotion } = useGlobals()
  const isBattling = useSelector(
    actor,
    (state) => state.matches('PLAYING') || state.matches('GAME_OVER'),
  )
  const isLocal = useSelector(actor, (state) => state.context.mode === 'local')

  const accumulator = useRef(0)
  const worldRef = useRef<Container>(null)

  useTick(({ deltaMS }) => {
    if (isAppDrawerOpen.current) return

    // Online, the match pauses while the opponent's tab is hidden —
    // a hidden tab can't simulate, so suspending both peers is the only
    // way the two simulations stay in agreement (and it prevents any
    // position jump when the opponent returns).
    if (actor.getSnapshot().context.friendPaused) return

    // juice: hit-stop — freeze physics briefly on heavy impacts and drop
    // the elapsed time so there's no catch-up burst afterwards.
    if (vfx.hitStopMs > 0) {
      vfx.hitStopMs -= deltaMS
      accumulator.current = 0
    } else {
      accumulator.current += Math.min(deltaMS, MAX_ACCUMULATED_FREQUENCY)

      while (accumulator.current >= FREQUENCY) {
        updateEngine(FREQUENCY)

        accumulator.current -= FREQUENCY
      }
    }

    // juice: screen shake — amplitude = trauma², so rapid hits compound.
    // Skipped under reduced motion (trauma still decays).
    vfx.shake = Math.max(0, vfx.shake - deltaMS / 700)

    const world = worldRef.current
    if (!world) return

    const strength = isReducedMotion.current ? 0 : vfx.shake * vfx.shake

    world.rotation = rand(0.015) * strength
    world.position.x = rand(16) * strength + centerX
    world.position.y = rand(16) * strength + centerY
  })

  return (
    <pixiContainer>
      {spritesheet && (
        <pixiSprite
          texture={spritesheet.textures['backdrop']}
          width={width}
          height={height}
        />
      )}
      <pixiContainer ref={worldRef} x={centerX} y={centerY} scale={scaleFactor}>
        <Arena />
        <Crosshair />
        {isBattling ? isLocal ? <Battle /> : <NetBattle /> : null}
      </pixiContainer>
    </pixiContainer>
  )
}
