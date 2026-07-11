import { audio } from '../../lib/audio'
import { patternWindow } from '../../lib/common'
import { store } from '../../lib/store'
import { createSequencer, modeAt, MODES } from '../../lib/transport'

const DIVISION = 16 // a 16-step pattern runs in 16th notes

type Knobs = {
  length: number
  offset: number
  swing: number
  playMode: number
}

/** Everything playback needs, derived from raw context. Shared by engine, grid and HUD. */
export function patternSettings(context: Knobs) {
  return {
    ...patternWindow(context),
    swing: context.swing,
    mode: modeAt(MODES.pattern, context.playMode),
  }
}

export const pattern = createSequencer(
  () => ({ division: DIVISION, swing: store.get().swing }),
  (next, count, time) => {
    const ctx = store.get()
    const { len, off, mode } = patternSettings(ctx)
    // The window steps; the absolute column is what we play and surface. Columns
    // outside [off, off+len) are never visited, so they're skipped for free.
    const column = off + next(mode, count, len)
    for (const note of ctx.grid[column]) audio.play(note, 0.9, time) // chord
    return column // every step, even empty — the cursor walks the grid as it plays
  },
)
