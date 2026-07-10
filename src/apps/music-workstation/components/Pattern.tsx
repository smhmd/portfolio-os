import { useEffect, useRef } from 'react'

import { useApplication, useTick } from '@pixi/react'
import { useSelector } from '@xstate/react'
import clsx from 'clsx'
import type { Graphics } from 'pixi.js'

import { audioContext } from 'src/lib/audio'

import { actor, modeAt, MODES, pattern, patternWindow, STEPS } from '../lib'
import { Canvas } from './Canvas'

const BLUE = '#6f87ff'
const BROWN = '#ab8567'
const ORANGE = '#d54922'
const GRAY = '#a8a29e'

const DIM = 0x5a6a72 // the always-present full-grid silhouette
const LIT = 0xbfe9ef // the active window, lit over the silhouette
const CURSOR = 0x3b6cff // the working column
const NOTE_IN = 0xf2d35c // a note inside the window (will play)
const NOTE_OUT = 0xdfe8ec // a note parked outside the window
const ARROW = 0xffffff

// White keys are the grid's rows; black keys sit on the half-lanes between them.
const WHITE = ['F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'] // prettier-ignore
const MAX_LANE = WHITE.length - 1

const laneOf = (note: string) =>
  note.includes('#')
    ? WHITE.indexOf(note[0] + note.slice(-1)) + 0.5
    : WHITE.indexOf(note)

/** Pixi: the full grid stays put; the window is a lit region within it. */
function Grid() {
  const { app } = useApplication()
  const ref = useRef<Graphics>(null)

  useTick(() => {
    const g = ref.current
    if (!g) return

    const ctx = actor.getSnapshot().context
    const { grid, cursor, playing } = ctx
    const { len, off } = patternWindow(ctx)

    const W = app.screen.width
    const H = app.screen.height
    const padX = 16
    const top = 24 // clears the HUD readouts
    const gridH = H - top - 18 // room for the cursor arrow beneath
    const cols = STEPS + 1 // 16 steps + the decorative trailing column
    const cellW = (W - 2 * padX) / cols
    const vx = (c: number) => padX + c * cellW // column boundary line
    const cx = (s: number) => padX + (s + 0.5) * cellW // step-cell center
    const ly = (lane: number) => top + (1 - lane / MAX_LANE) * gridH

    g.clear()

    // 1. Silhouette — the whole grid, always visible
    for (let c = 0; c <= cols; c++)
      g.moveTo(vx(c), top).lineTo(vx(c), top + gridH)
    for (let l = 0; l <= MAX_LANE; l++)
      g.moveTo(padX, ly(l)).lineTo(W - padX, ly(l))
    g.stroke({ width: 1, color: DIM, alpha: 0.55 })

    // 2. Cursor column (follows the sounding column while playing)
    const ph = pattern.playhead(audioContext.currentTime)
    const active = playing ? Math.max(off, ph) : cursor
    g.rect(vx(active), top, cellW, gridH).fill({ color: CURSOR, alpha: 0.4 })

    // 3. Window — the active region, lit on top of the silhouette
    for (let c = off; c <= off + len; c++)
      g.moveTo(vx(c), top).lineTo(vx(c), top + gridH)
    for (let l = 0; l <= MAX_LANE; l++)
      g.moveTo(vx(off), ly(l)).lineTo(vx(off + len), ly(l))
    g.stroke({ width: 1, color: LIT, alpha: 0.9 })

    // 4. Notes — every placed note shows; yellow inside the window, white outside
    const r = Math.min(cellW, gridH / MAX_LANE) * 0.28
    for (let s = off; s < off + len; s++)
      for (const note of grid[s]) g.circle(cx(s), ly(laneOf(note)), r)
    g.fill({ color: NOTE_IN })
    for (let s = 0; s < STEPS; s++) {
      if (s >= off && s < off + len) continue
      for (const note of grid[s]) g.circle(cx(s), ly(laneOf(note)), r)
    }
    g.fill({ color: NOTE_OUT })

    // 5. Cursor arrow
    const ax = cx(active)
    const ay = top + gridH + 5
    g.poly([ax, ay, ax - 5, ay + 7, ax + 5, ay + 7]).fill(ARROW)
  })

  return <pixiGraphics ref={ref} />
}

/** HTML: window + groove + play-mode readouts. */
function Readout() {
  const context = useSelector(actor, ({ context }) => context)
  const { len, off } = patternWindow(context)
  const mode = modeAt(MODES.pattern, context.playMode)

  return (
    <div className='pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-wide'>
      <div style={{ color: BLUE }}>move {off}</div>
      <div style={{ color: BROWN }}>{Math.round(context.swing * 100)}%</div>
      <div style={{ color: GRAY }}>trim {len}</div>
      <div
        className={clsx('text-sm', mode === 'backward' && '-scale-x-100')}
        style={{ color: ORANGE }}>
        {mode === 'forward' ? '←' : mode === 'backward' ? 'R' : '⇄'}
      </div>
    </div>
  )
}

export default function Pattern() {
  // This screen is mounted exactly while it's on-screen, so it owns the transport.
  const playing = useSelector(actor, ({ context }) => context.playing)
  useEffect(() => {
    if (!playing) return
    pattern.start()
    return () => pattern.stop()
  }, [playing])

  return (
    <>
      <Readout />
      <Canvas>
        <Grid />
      </Canvas>
    </>
  )
}
