import { clamp } from 'src/lib/math'

export const APP_ID = 'music-workstation'
export const STEPS = 16
export const DEFAULT_BPM = 120
export const SCHEDULE_AHEAD_TIME = 0.1 // How far ahead to schedule audio (in seconds)
export const SCHEDULE_INTERVAL = 25 // How often to schedule the next audio events (in milliseconds)
export const MAX_STEPS = 32 // Endless sequencer capacity

/** Default parameter values. Shared by the machine and the audio graph. */
export const INITIAL = {
  volume: 0.8, // 0..1
  muted: false,
  // tombola
  spin: 1, // -10..10, 0 = no rotation
  gravity: 0.5, // 0..1
  bounce: 0.6, // 0..1
  rods: 0, // 0..1, 0 = closed hexagon, 1 = rods fully rotated open
  // endless (swing / playMode / playing are shared with pattern)
  division: 0, // 0..1 → 1/4 … 1/16
  swing: 0.5, // 0..1, 0.5 = straight
  gate: 0, // 0..1 → gate pattern index
  playMode: 0, // unbounded, wraps through the active screen's play modes
  sequence: [] as (string | null)[],
  playing: false,
  // pattern
  grid: Array.from({ length: STEPS }, () => [] as string[]), // notes per step
  cursor: 0, // editing column, always kept inside the window
  length: STEPS, // 1..16 window length (gray / TRIM)
  offset: 0, // 0..15 window start (blue / MOVE)
}

/**
 * The pattern's active window from raw knob values. Length and offset are
 * stored as floats (so the encoders feel smooth) and resolved to consistent
 * integers here — the one place that rounds, shared by machine, Scene and HUD.
 */
export function patternWindow({
  length,
  offset,
}: {
  length: number
  offset: number
}) {
  const len = clamp(1, Math.round(length), STEPS)
  const off = clamp(0, Math.round(offset), STEPS - len)
  return { len, off }
}

export const KEYS = [
  // Triplet keys:
  { note: 'F#3', variant: 'right' },
  { note: 'G#3', variant: 'middle' },
  { note: 'A#3', variant: 'left' },

  // Twin keys:
  { note: 'C#4', variant: 'right' },
  { note: 'D#4', variant: 'left' },

  // Triplet keys:
  { note: 'F#4', variant: 'right' },
  { note: 'G#4', variant: 'middle' },
  { note: 'A#4', variant: 'left' },

  // Twin keys:
  { note: 'C#5', variant: 'right' },
  { note: 'D#5', variant: 'left' },

  // White keys:
  { note: 'F3', variant: 'vertical' },
  { note: 'G3', variant: 'vertical' },
  { note: 'A3', variant: 'vertical' },
  { note: 'B3', variant: 'vertical' },
  { note: 'C4', variant: 'vertical' },
  { note: 'D4', variant: 'vertical' },
  { note: 'E4', variant: 'vertical' },
  { note: 'F4', variant: 'vertical' },
  { note: 'G4', variant: 'vertical' },
  { note: 'A4', variant: 'vertical' },
  { note: 'B4', variant: 'vertical' },
  { note: 'C5', variant: 'vertical' },
  { note: 'D5', variant: 'vertical' },
  { note: 'E5', variant: 'vertical' },
] as const
