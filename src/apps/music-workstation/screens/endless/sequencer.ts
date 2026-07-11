import { audio } from '../../lib/audio'
import { store } from '../../lib/store'
import { createSequencer, modeAt, MODES } from '../../lib/transport'

export const DIVISIONS = [4, 8, 16] // 1/4 … 1/16 per step

/**
 * Curated gate masks as binary strings: '1' = step heard, '0' = skipped.
 * Ordered short → long so the knob sweeps from simple to complex.
 * The leading '1' is the no-gate default (knob at 0 = straight playback).
 */
export const PATTERNS = [
  '1', // no gating
  '101',
  '1101',
  '11101',
  '01001',
  '111101',
  '0010001',
  '0101001',
  '0101011',
  '0110111',
  '01101101',
  '010101001',
  '0110110111',
  '011010110101',
  '0101010101001',
  '0110110110111',
  '01101101101101',
  '0010010010010001',
]

const pick = <T>(list: T[], value: number) =>
  list[Math.min(Math.floor(value * list.length), list.length - 1)]

type KnobValues = {
  division: number
  swing: number
  gate: number
  playMode: number
}

/** Derive playback settings from raw knob values. Shared by engine and HUD. */
export function settings({ division, swing, gate, playMode }: KnobValues) {
  return {
    division: pick(DIVISIONS, division),
    swing,
    pattern: pick(PATTERNS, gate),
    mode: modeAt(MODES.endless, playMode),
  }
}

export const endless = createSequencer(
  () => settings(store.get()),
  (next, count, time) => {
    const ctx = store.get()
    if (!ctx.sequence.length) return -1
    const { pattern, mode } = settings(ctx)
    const index = next(mode, count, ctx.sequence.length)
    const note = ctx.sequence[index]
    // Surface (and sound) only audible steps, so the counter tracks real notes.
    if (note && pattern[count % pattern.length] === '1') {
      audio.play(note, 0.9, time)
      return index
    }
    return -1
  },
)
