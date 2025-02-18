import { assign, createMachine } from 'xstate'

import { APP_ID, type Direction, type State } from './common'
import {
  addTile,
  checkLost,
  checkWon,
  initializeState,
  mergeTiles,
  moveTiles,
  persistState,
  reset,
} from './utils'

type Events =
  | { type: 'start' }
  | { type: 'move'; payload: Direction }
  | { type: 'reset' }
  | { type: 'continue' }

const initialState = {
  board: [],
  score: 0,
  best: 0,
  updated: true,
  won: false,
} satisfies State

export const machine = createMachine({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  context: initialState,
  id: APP_ID,
  description: 'The state machine for the game 2048.',
  initial: 'IDLE',
  states: {
    IDLE: {
      on: {
        start: {
          target: 'START',
          actions: assign(initializeState),
        },
      },
    },
    START: {
      always: [
        {
          target: 'WON',
          guard: ({ context }) => checkWon(context),
          actions: assign({ won: true }),
        },
        {
          target: 'LOST',
          guard: ({ context }) => checkLost(context.board),
        },
        {
          target: 'PLAYING',
        },
      ],
    },
    PLAYING: {
      on: {
        move: {
          target: 'MOVING',
          actions: assign(({ context, event }) =>
            moveTiles({
              board: context.board,
              direction: event.payload,
            }),
          ),
        },
      },
    },
    MOVING: {
      always: {
        // If no tiles were updated, go to PLAYING state
        target: 'PLAYING',
        guard: ({ context }) => !context.updated,
      },
      after: {
        '60': {
          // After a delay, if there are updated tiles, go to SPAWNING state
          // The delay is there to allow spawning animation and moving animation from colliding.
          // I wanna improve this, tbh. :(
          // It's not bad design. It's just makes the game not as snappy as it possible could be.
          target: 'SPAWNING',
          actions: assign(({ context }) => mergeTiles(context)),
          guard: ({ context }) => context.updated,
        },
      },
    },
    SPAWNING: {
      always: {
        target: 'CHECKING',
        actions: assign({
          board: ({ context }) => addTile(context.board),
        }),
      },
    },
    CHECKING: {
      entry: ({ context }) => persistState(context),
      always: [
        {
          target: 'WON',
          guard: ({ context }) => checkWon(context),
          actions: assign({ won: true }),
        },
        {
          target: 'LOST',
          guard: ({ context }) => checkLost(context.board),
        },
        {
          target: 'PLAYING',
        },
      ],
    },
    WON: {
      on: {
        continue: {
          target: 'PLAYING',
        },
      },
    },
    LOST: {},
  },
  on: {
    reset: {
      target: '.START',
      actions: assign(({ context }) => reset(context)),
    },
  },
})
