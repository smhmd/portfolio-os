import { useRef } from 'react'

import { useApplication, useTick } from '@pixi/react'
import { useSelector } from '@xstate/react'
import type { Graphics } from 'pixi.js'

import {
  actor,
  audio,
  BALL_RADIUS,
  CAGE_RADIUS,
  ROD_LENGTH,
  SIDES,
  tombola,
} from '../lib'
import { Canvas } from './Canvas'

const BLUE = '#6f87ff'
const BROWN = '#ab8567'
const ORANGE = '#d54922'
const ORANGE_DARK = '#200a02'
const ROD_COLOR = 0xe8e6e3
const NOTE_COLOR = 0x6f87ff
const SHRINK = 0.65 // cage takes up this much of the available screen
const PADDING = 10

/** Pixi: physics stepping and cage/note rendering. */
function Cage() {
  const { app } = useApplication()
  const ref = useRef<Graphics>(null)

  useTick((ticker) => {
    const graphics = ref.current
    if (!graphics) return

    // The machine is the source of truth; the loop just reads it.
    const { spin, gravity, bounce, rods } = actor.getSnapshot().context
    const dt = Math.min(ticker.deltaMS / 1000, 1 / 30) // clamp tab-switch jumps
    for (const { note, impact } of tombola.step(dt, {
      spin,
      gravity,
      bounce,
      rods,
    })) {
      audio.play(note, Math.min(impact / 500, 1))
    }

    const { width, height } = app.screen
    graphics.position.set(width / 2, height / 2)
    graphics.scale.set(
      ((Math.min(width, height) / 2 - PADDING) / CAGE_RADIUS) * SHRINK,
    )
    graphics.clear()

    // Rods — six independent segments instead of a closed polygon,
    // so they can rotate open and leak notes through the corners
    for (let side = 0; side < SIDES; side++) {
      const { mx, my, dx, dy } = tombola.rodAt(side, rods)
      graphics.moveTo(mx - dx * ROD_LENGTH, my - dy * ROD_LENGTH)
      graphics.lineTo(mx + dx * ROD_LENGTH, my + dy * ROD_LENGTH)
    }
    graphics.stroke({ width: 3, color: ROD_COLOR, cap: 'round' })

    // Notes
    for (const { x, y } of tombola.balls) {
      graphics.circle(x, y, BALL_RADIUS).fill(NOTE_COLOR)
    }
  })

  return <pixiGraphics ref={ref} />
}

/** HTML: parameter readouts overlaid on the screen. */
function Readout() {
  const { spin, gravity, bounce } = useSelector(actor, ({ context }) => context)

  return (
    <div className='pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-2 text-xs lowercase'>
      <div className='text-sm' style={{ color: BLUE }}>
        {Math.round(spin)}
      </div>

      <div className='flex items-center gap-1.5'>
        <div
          className='grid size-4 place-items-center rounded-full'
          style={{ background: BROWN }}>
          <div
            className='rounded-full bg-white'
            style={{ width: 2 + gravity * 12, height: 2 + gravity * 12 }}
          />
        </div>
        <div style={{ color: BROWN }}>gravity</div>
      </div>

      <div className='flex items-center gap-1.5'>
        <div style={{ color: ORANGE }}>bounce</div>
        <div
          className='relative h-4 w-6'
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            background: ORANGE_DARK,
          }}>
          <div
            className='absolute inset-y-0 left-0'
            style={{ width: `${bounce * 100}%`, background: ORANGE }}
          />
        </div>
      </div>
    </div>
  )
}

export default function Tombola() {
  return (
    <>
      <Readout />
      <Canvas>
        <Cage />
      </Canvas>
    </>
  )
}
