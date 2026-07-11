import clsx from 'clsx'

import { Hud, Item } from '../../components/Hud'
import {
  COLORS,
  modeAt,
  MODES,
  patternWindow,
  STEPS,
  store,
  useTransport,
} from '../../lib'
import { pattern } from './sequencer'

// Screen-local palette; the readout colors come from the shared theme.
const DIM = '#5a6a72' // the always-present full-grid silhouette
const LIT = '#bfe9ef' // the active window, lit over the silhouette
const CURSOR = '#3b6cff' // the working column
const NOTE_IN = '#f2d35c' // a note inside the window (will play)
const NOTE_OUT = '#dfe8ec' // a note parked outside the window
const ARROW = '#ffffff'

// The viewBox matches the graphics area below the HUD band; strokes are
// non-scaling, so nothing blurs as it stretches.
const W = 500
const H = 240
const PAD_X = 16
const TOP = 12
const GRID_H = H - TOP - 20 // room for the cursor arrow beneath
const COLS = STEPS + 1 // 16 steps + the decorative trailing column
const CELL_W = (W - 2 * PAD_X) / COLS

// White keys are the grid's rows; black keys sit on the half-lanes between them.
const WHITE = ['F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'] // prettier-ignore
const MAX_LANE = WHITE.length - 1
const RADIUS = Math.min(CELL_W, GRID_H / MAX_LANE) * 0.28

const laneOf = (note: string) =>
  note.includes('#')
    ? WHITE.indexOf(note[0] + note.slice(-1)) + 0.5
    : WHITE.indexOf(note)

const vx = (c: number) => PAD_X + c * CELL_W // column boundary line
const cx = (s: number) => PAD_X + (s + 0.5) * CELL_W // step-cell center
const ly = (lane: number) => TOP + (1 - lane / MAX_LANE) * GRID_H

/** Column lines c0..c1 plus the lane lines spanning them, as one path. */
function gridPath(c0: number, c1: number) {
  let d = ''
  for (let c = c0; c <= c1; c++) d += `M${vx(c)} ${TOP}V${TOP + GRID_H}`
  for (let l = 0; l <= MAX_LANE; l++) d += `M${vx(c0)} ${ly(l)}H${vx(c1)}`
  return d
}

const SILHOUETTE = gridPath(0, COLS)

/** SVG: the full grid stays put; the window is a lit region within it. */
function Grid() {
  const context = store.use()
  const { grid, cursor, playing } = context
  const { len, off } = patternWindow(context)

  // Mounted exactly while on-screen, so it owns the transport.
  const head = useTransport(pattern, playing)
  const active = playing ? Math.max(off, head) : cursor
  const ax = cx(active)
  const ay = TOP + GRID_H + 5

  return (
    <svg
      className='absolute inset-0 size-full'
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio='none'>
      {/* Silhouette — the whole grid, always visible */}
      <path
        d={SILHOUETTE}
        fill='none'
        stroke={DIM}
        strokeOpacity={0.55}
        vectorEffect='non-scaling-stroke'
      />

      {/* Cursor column (follows the sounding column while playing) */}
      <rect
        x={vx(active)}
        y={TOP}
        width={CELL_W}
        height={GRID_H}
        fill={CURSOR}
        fillOpacity={0.4}
      />

      {/* Window — the active region, lit on top of the silhouette */}
      <path
        d={gridPath(off, off + len)}
        fill='none'
        stroke={LIT}
        strokeOpacity={0.9}
        vectorEffect='non-scaling-stroke'
      />

      {/* Notes — every placed note shows; yellow inside the window, white outside */}
      {grid.flatMap((column, s) =>
        column.map((note) => (
          <circle
            key={`${s}:${note}`}
            cx={cx(s)}
            cy={ly(laneOf(note))}
            r={RADIUS}
            fill={s >= off && s < off + len ? NOTE_IN : NOTE_OUT}
          />
        )),
      )}

      {/* Cursor arrow */}
      <path d={`M${ax} ${ay}l-5 7h10Z`} fill={ARROW} />
    </svg>
  )
}

/** Window + groove + play-mode readouts. */
function Readout() {
  const context = store.use()
  const { len, off } = patternWindow(context)
  const mode = modeAt(MODES.pattern, context.playMode)

  return (
    <Hud>
      <Item color={COLORS.blue} label='move'>
        {off}
      </Item>
      <Item color={COLORS.brown} label='swing'>
        {Math.round(context.swing * 100)}%
      </Item>
      <Item color={COLORS.gray} label='trim'>
        {len}
      </Item>
      <Item color={COLORS.orange}>
        <span
          className={clsx(mode === 'backward' && 'inline-block -scale-x-100')}>
          {mode === 'forward' ? '←' : mode === 'backward' ? 'R' : '⇄'}
        </span>
      </Item>
    </Hud>
  )
}

export default function Pattern() {
  return (
    <>
      <Readout />
      <div className='relative flex-1'>
        <Grid />
      </div>
    </>
  )
}
