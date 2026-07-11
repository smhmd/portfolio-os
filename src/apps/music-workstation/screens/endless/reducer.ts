import { audio } from '../../lib/audio'
import type { Controls, KnobMap, State } from '../../lib/common'
import { MAX_STEPS } from '../../lib/common'

export const knobs: KnobMap = {
  blue: { key: 'division', perTurn: 1, min: 0, max: 1 },
  brown: { key: 'swing', perTurn: 1, min: 0, max: 1 },
  gray: { key: 'gate', perTurn: 1, min: 0, max: 1 },
  // Unbounded: keeps wrapping through the play modes forever
  orange: { key: 'playMode', perTurn: 1, min: -Infinity, max: Infinity },
}

/**
 * A key press records the note (live edits welcome) and gives immediate
 * feedback only when the transport is stopped.
 */
export function attack(state: State, note: string) {
  if (!state.playing) audio.play(note)
  if (state.sequence.length === MAX_STEPS) return
  return { sequence: [...state.sequence, note] }
}

const backspace = ({ sequence }: State) => ({ sequence: sequence.slice(0, -1) })

// left / delete both backspace the last step; space appends a rest.
export const controls: Controls = {
  left: backspace,
  delete: backspace,
  space: ({ sequence }) =>
    sequence.length < MAX_STEPS ? { sequence: [...sequence, null] } : undefined,
  play: ({ playing }) => ({ playing: !playing }),
  reset: () => ({ sequence: [], playing: false }),
}
