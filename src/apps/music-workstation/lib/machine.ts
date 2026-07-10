import { assign, createActor, createMachine } from 'xstate'

import { clamp } from 'src/lib/math'
import type { API } from 'src/lib/types'

import { audio } from './audio'
import { APP_ID, INITIAL, MAX_STEPS, patternWindow, STEPS } from './common'
import { tombola } from './tombola'

export type ParameterId = 'blue' | 'brown' | 'gray' | 'orange'
export type Step = string | null // null = rest

// Pattern feature flags — knobs we want to flip and feel out later.
const ADVANCE_ON_KEY = true // melody mode: a key press steps the cursor forward
const RESET_CURSOR_ON_PAUSE = true // pausing returns the cursor to the window start

type KnobKey =
  | 'spin'
  | 'gravity'
  | 'bounce'
  | 'rods'
  | 'division'
  | 'swing'
  | 'gate'
  | 'playMode'
type Knob = { key: KnobKey; perTurn: number; min: number; max: number }

/**
 * Knob → parameter routing *per screen*. The same four encoders mean
 * different things depending on which state the machine is in. (Pattern's
 * blue/gray knobs are coupled, so they're handled directly below instead.)
 */
const KNOBS = {
  TOMBOLA: {
    blue: { key: 'spin', perTurn: 10, min: -10, max: 10 },
    brown: { key: 'gravity', perTurn: 1, min: 0, max: 1 },
    gray: { key: 'rods', perTurn: 1, min: 0, max: 1 },
    orange: { key: 'bounce', perTurn: 1, min: 0, max: 1 },
  },
  ENDLESS: {
    blue: { key: 'division', perTurn: 1, min: 0, max: 1 },
    brown: { key: 'swing', perTurn: 1, min: 0, max: 1 },
    gray: { key: 'gate', perTurn: 1, min: 0, max: 1 },
    // Unbounded: keeps wrapping through the play modes forever
    orange: { key: 'playMode', perTurn: 1, min: -Infinity, max: Infinity },
  },
} as const satisfies Record<string, Record<ParameterId, Knob>>

type State = {
  volume: number
  muted: boolean
  // tombola
  spin: number
  gravity: number
  bounce: number
  rods: number
  // endless (swing / playMode / playing shared with pattern)
  division: number
  swing: number
  gate: number
  playMode: number
  sequence: Step[]
  playing: boolean
  // pattern
  grid: string[][]
  cursor: number
  length: number
  offset: number
}

type Events =
  | { type: 'volume.change'; payload: number } // delta in turns
  | { type: 'volume.mute' }
  | { type: 'note.attack'; payload: string }
  | { type: 'note.release' }
  | { type: 'tombola.show' }
  | { type: 'endless.show' }
  | { type: 'pattern.show' }
  // Generic transport/edit controls — each screen interprets them itself
  | { type: 'control.left' }
  | { type: 'control.right' }
  | { type: 'control.play' }
  | { type: 'control.delete' }
  | { type: 'parameter.change'; payload: { id: ParameterId; delta: number } }

/** Accumulate an endless-encoder delta into whatever the given table routes it to. */
const applyKnob = (knobs: Record<ParameterId, Knob>) =>
  assign(({ context, event }: { context: State; event: Events }) => {
    const { payload } = event as Extract<Events, { type: 'parameter.change' }>
    const { key, perTurn, min, max } = knobs[payload.id]
    return {
      ...context,
      [key]: clamp(min, context[key] + payload.delta * perTurn, max),
    }
  })

const applyVolume = ({ context }: { context: State }) =>
  audio.setVolume(context.muted ? 0 : context.volume)

export const machine = createMachine({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  id: APP_ID,
  initial: 'TOMBOLA',
  context: { ...INITIAL },
  states: {
    TOMBOLA: {
      on: {
        // A key press drops a ball; it sounds when it bounces.
        'note.attack': {
          actions: ({ event }) => tombola.add(event.payload),
        },
        'parameter.change': { actions: applyKnob(KNOBS.TOMBOLA) },
      },
    },

    ENDLESS: {
      // Whatever happens, don't come back to a ghost transport
      exit: assign({ playing: false }),
      on: {
        // A key press records the note (live edits welcome) and gives
        // immediate feedback only when the transport is stopped.
        'note.attack': {
          actions: [
            assign({
              sequence: ({ context, event }) =>
                context.sequence.length < MAX_STEPS
                  ? [...context.sequence, event.payload]
                  : context.sequence,
            }),
            ({ context, event }) => {
              if (!context.playing) audio.play(event.payload)
            },
          ],
        },
        // left / delete both backspace the last step; right appends a rest.
        'control.left': {
          actions: assign({
            sequence: ({ context }) => context.sequence.slice(0, -1),
          }),
        },
        'control.delete': {
          actions: assign({
            sequence: ({ context }) => context.sequence.slice(0, -1),
          }),
        },
        'control.right': {
          actions: assign({
            sequence: ({ context }) =>
              context.sequence.length < MAX_STEPS
                ? [...context.sequence, null]
                : context.sequence,
          }),
        },
        'control.play': {
          actions: assign({ playing: ({ context }) => !context.playing }),
        },
        'parameter.change': { actions: applyKnob(KNOBS.ENDLESS) },
      },
    },

    PATTERN: {
      exit: assign({ playing: false }),
      on: {
        // Toggle the note at the cursor (heard only the first time it's added),
        // then step forward within the window — looping back to the start.
        'note.attack': {
          actions: [
            ({ context, event }) => {
              if (!context.grid[context.cursor].includes(event.payload))
                audio.play(event.payload)
            },
            assign(({ context, event }) => {
              const note = event.payload
              const { len, off } = patternWindow(context)
              const col = context.cursor
              const column = context.grid[col]
              const next = column.includes(note)
                ? column.filter((n) => n !== note)
                : [...column, note]
              return {
                grid: context.grid.map((c, i) => (i === col ? next : c)),
                cursor: ADVANCE_ON_KEY ? off + ((col - off + 1) % len) : col,
              }
            }),
          ],
        },
        // Nudge the cursor; clamped to the window so chords stack on one column.
        'control.left': {
          actions: assign(({ context }) => {
            const { off } = patternWindow(context)
            return { cursor: Math.max(off, context.cursor - 1) }
          }),
        },
        'control.right': {
          actions: assign(({ context }) => {
            const { len, off } = patternWindow(context)
            return { cursor: Math.min(off + len - 1, context.cursor + 1) }
          }),
        },
        // Smart backspace: clear this column and stay; if it's already empty,
        // back up toward the start and clear that one — until nothing's left.
        'control.delete': {
          actions: assign(({ context }) => {
            const { off } = patternWindow(context)
            const col = context.cursor
            if (context.grid[col].length > 0)
              return { grid: context.grid.map((c, i) => (i === col ? [] : c)) }
            const prev = Math.max(off, col - 1)
            return {
              cursor: prev,
              grid: context.grid.map((c, i) => (i === prev ? [] : c)),
            }
          }),
        },
        // Play / pause; pausing parks the cursor back at the window start.
        'control.play': {
          actions: assign(({ context }) => {
            const playing = !context.playing
            const { off } = patternWindow(context)
            return {
              playing,
              cursor: !playing && RESET_CURSOR_ON_PAUSE ? off : context.cursor,
            }
          }),
        },
        // brown / orange borrow endless's swing + play modes; blue / gray drive
        // the coupled window (offset / length) and keep the cursor inside it.
        'parameter.change': {
          actions: assign(({ context, event }) => {
            const { id, delta } = event.payload
            if (id === 'brown')
              return { swing: clamp(0, context.swing + delta, 1) }
            if (id === 'orange') return { playMode: context.playMode + delta }

            if (id === 'gray') {
              const length = clamp(1, context.length + delta * STEPS, STEPS)
              // Grow right first, then left: pin to the right edge once it fills.
              const offset = Math.min(context.offset, STEPS - length)
              const { len, off } = patternWindow({ length, offset })
              return {
                length,
                offset,
                cursor: clamp(off, context.cursor, off + len - 1),
              }
            }
            // blue → move the window
            const offset = clamp(
              0,
              context.offset + delta * STEPS,
              STEPS - context.length,
            )
            const { len, off } = patternWindow({
              length: context.length,
              offset,
            })
            return {
              offset,
              cursor: clamp(off, context.cursor, off + len - 1),
            }
          }),
        },
      },
    },
  },
  on: {
    'tombola.show': { target: '.TOMBOLA' },
    'endless.show': { target: '.ENDLESS' },
    'pattern.show': { target: '.PATTERN' },
    'volume.change': {
      actions: [
        assign({
          volume: ({ context, event }) =>
            clamp(0, context.volume + event.payload, 1),
        }),
        applyVolume,
      ],
    },
    'volume.mute': {
      actions: [
        assign({ muted: ({ context }) => !context.muted }),
        applyVolume,
      ],
    },
    'note.release': {},
  },
})

export const actor = createActor(machine)

export const api = {
  changeVolume(payload) {
    actor.send({ type: 'volume.change', payload })
  },
  muteVolume() {
    actor.send({ type: 'volume.mute' })
  },
  attackNote(payload) {
    actor.send({ type: 'note.attack', payload })
  },
  releaseNote() {
    actor.send({ type: 'note.release' })
  },
  showTombola() {
    actor.send({ type: 'tombola.show' })
  },
  showEndless() {
    actor.send({ type: 'endless.show' })
  },
  showPattern() {
    actor.send({ type: 'pattern.show' })
  },
  // Context-dependent controls: the active screen decides what they do.
  leftControl() {
    actor.send({ type: 'control.left' })
  },
  rightControl() {
    actor.send({ type: 'control.right' })
  },
  playControl() {
    actor.send({ type: 'control.play' })
  },
  deleteControl() {
    actor.send({ type: 'control.delete' })
  },
  changeParameter(payload) {
    actor.send({ type: 'parameter.change', payload })
  },
} satisfies API<Events>

actor.start()
