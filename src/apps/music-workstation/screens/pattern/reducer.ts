import { clamp } from 'src/lib/math'

import { audio } from '../../lib/audio'
import type { Controls, KnobMap, State } from '../../lib/common'
import { patternWindow, STEPS } from '../../lib/common'

// Feature flags — knobs we want to flip and feel out later.
const ADVANCE_ON_KEY = true // melody mode: a key press steps the cursor forward
const RESET_CURSOR_ON_PAUSE = true // pausing returns the cursor to the window start

/** blue → move the window; the cursor is dragged along to stay inside it. */
function move(state: State, delta: number): Partial<State> {
  const offset = clamp(0, state.offset + delta * STEPS, STEPS - state.length)
  const { len, off } = patternWindow({ length: state.length, offset })
  return { offset, cursor: clamp(off, state.cursor, off + len - 1) }
}

/** gray → trim the window. Grows right first: pinned to the right edge once it fills. */
function trim(state: State, delta: number): Partial<State> {
  const length = clamp(1, state.length + delta * STEPS, STEPS)
  const offset = Math.min(state.offset, STEPS - length)
  const { len, off } = patternWindow({ length, offset })
  return { length, offset, cursor: clamp(off, state.cursor, off + len - 1) }
}

// brown / orange borrow endless's swing + play modes; blue / gray drive the
// coupled window (offset / length), so they're reducers instead of configs.
export const knobs: KnobMap = {
  blue: move,
  brown: { key: 'swing', perTurn: 1, min: 0, max: 1 },
  gray: trim,
  orange: { key: 'playMode', perTurn: 1, min: -Infinity, max: Infinity },
}

/**
 * Toggle the note at the cursor (heard only the first time it's added), then
 * step forward within the window — looping back to the start.
 */
export function attack(state: State, note: string) {
  const { len, off } = patternWindow(state)
  const col = state.cursor
  const column = state.grid[col]
  if (!column.includes(note)) audio.play(note)
  const next = column.includes(note)
    ? column.filter((n) => n !== note)
    : [...column, note]
  return {
    grid: state.grid.map((c, i) => (i === col ? next : c)),
    cursor: ADVANCE_ON_KEY ? off + ((col - off + 1) % len) : col,
  }
}

export const controls: Controls = {
  // Nudge the cursor; clamped to the window so chords stack on one column.
  left(state) {
    const { off } = patternWindow(state)
    return { cursor: Math.max(off, state.cursor - 1) }
  },
  right(state) {
    const { len, off } = patternWindow(state)
    return { cursor: Math.min(off + len - 1, state.cursor + 1) }
  },
  // A rest: step forward leaving the column untouched, wrapping like a key press.
  space(state) {
    const { len, off } = patternWindow(state)
    return { cursor: off + ((state.cursor - off + 1) % len) }
  },
  // Play / pause; pausing parks the cursor back at the window start.
  play(state) {
    const playing = !state.playing
    const { off } = patternWindow(state)
    return {
      playing,
      cursor: !playing && RESET_CURSOR_ON_PAUSE ? off : state.cursor,
    }
  },
  // Smart backspace: clear this column and stay; if it's already empty,
  // back up toward the start and clear that one — until nothing's left.
  delete(state) {
    const { off } = patternWindow(state)
    const col = state.cursor
    if (state.grid[col].length > 0)
      return { grid: state.grid.map((c, i) => (i === col ? [] : c)) }
    const prev = Math.max(off, col - 1)
    return {
      cursor: prev,
      grid: state.grid.map((c, i) => (i === prev ? [] : c)),
    }
  },
  // Wipe the grid and park at the window start.
  reset(state) {
    return {
      grid: state.grid.map(() => []),
      cursor: patternWindow(state).off,
      playing: false,
    }
  },
}
