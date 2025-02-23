import { createMachine } from 'xstate'

import { APP_ID, DEFAULT_BPM, STEPS } from './common'
import {} from './utils'

type Events =
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'toggle_cell' }
  | { type: 'set_bpm' }

type State = {
  steps: number
  grid: boolean[][]
  bpm: number
  currentStep: number
  nextNoteTime: number
  schedulerTimer: number
}

const initialState = {
  steps: STEPS,
  grid: [],
  bpm: DEFAULT_BPM,
  currentStep: 0,
  nextNoteTime: 0,
  schedulerTimer: 0,
} satisfies State

export const machine = createMachine({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  context: initialState,
  id: APP_ID,
  description: 'The state machine for a drum machine.',
  initial: 'IDLE',
  states: {
    PAUSED: {
      on: {
        play: {
          target: 'PLAYING',
        },
      },
    },
    PLAYING: {
      on: {
        pause: {
          target: 'PAUSE',
        },
      },
    },
  },
})
