import { assign, setup } from 'xstate'

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

export const machine = setup({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  actions: {
    persist: ({ context }) => persistState(context),
    init: assign(initializeState),
    win: assign({ won: true }),
    merge: assign(({ context }) => mergeTiles(context)),
    reset: assign(({ context }) => reset(context)),
    add: assign(({ context }) => ({ board: addTile(context.board) })),
    move: assign(({ context, event }) => {
      if (event.type !== 'move') return {}
      return moveTiles({
        board: context.board,
        direction: event.payload,
      })
    }),
  },
  guards: {
    isWon: ({ context }) => checkWon(context),
    isLost: ({ context }) => checkLost(context.board),
    isNotUpdated: ({ context }) => !context.updated,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCc4wAXAbQAYBdRUABwHtZcrc39mQAHogCMANgDsAJgB04uqPniAHOICswgJyrJAGhABPRKOGrpdNeOF1VAFjrCbNpQF9netFjyEi0gJIARABkAURJYKnQyWkZ+dk5uXn4hBABmJRk6G2EUlIk1VVFRPUMEJSVhaQ1hcQl5VQ18lNd3DBwCYmkAYQAJYM6AaV8AOQBxEnomJBA4rh4+KeS1GzN8yTLhE01xYsQpcWkNjUkxUSVjcWVmkA827y7egeGxmmFJ1g5ZxIXd2xXVVUsSnUqjoGiUO1KNlM9XqklsGic5SuNy8HR6fUGo3Gkje0w+CXmoEWv3M-0BwNB4IMiA0ohkShsGg0oNUDPSrORrVRPgACoEAIIATSeJFQbAAbmAJrF8XMkjTMtIbJY6CkbJJaQzxCkIY4lNIUpJJOZxI4NCk6PJOZ52j4ALIAeQAaiLpVMZgT5Qhsil9pZNGttJI1XSISlfhY6GULg4UsJJKJrbcOo6XViBOF0FQwNJ0AAzbNkZAKUgo23SVNPN3veJy74IVl0aQM47HKHWeRFakIBPLXLB4wso3KmxJ7nSADKPP5AHUhq6Yu7ZV8iYhtMsmUpcgVWZsIRINNJRAV0ll1cyHGPyzOHUMSJheNx8ABXKWLmufQmCEQ5UxSSSMheaTHBCahNrkRxwmCxy+qOVz4GwEBwPwZbeDKtYrt+PaOM2xh2DkcIgtUVIlNkMj9rkyqiGqjIFFedwBCE6Gfl6Gr0nhqqGv89gkTSFoGgiwZWGIFr2PRaIPJiIzMZ69YgikBpKMymQAqIjjKqBIIGqIkH1Ok2SmuJvICsKowyXWq7ejYx6VA0GxKeadLGPuaRmEGFxSJadlGRWzpPOZmHJFYapKikDTKdZ8YaGGxxmGUCL2HIUZrD5U6zvOZlLhhX7JE4pjMpF8batGwgQtoTYag05QnqcWQ+TeQwBTlIjEZUap2eYZT2KooEJrhRx2OqOTCGcPmBA6E4ACpNV68byAc2rBloW5SGCEJnPqDL1NkBRqcoGiuK4QA */
  context: initialState,
  id: APP_ID,
  description: 'The state machine for the game 2048.',
  initial: 'IDLE',
  states: {
    IDLE: {
      on: {
        start: {
          description:
            'We start the machine manually because SSR prevents persisting to localstorage.',
          target: 'CHECKING',
          actions: 'init',
        },
      },
    },
    CHECKING: {
      always: [
        {
          description:
            'If the persisted game is already won, we transition to the WON state.',
          target: 'WON',
          guard: 'isWon',
        },
        {
          description:
            'If the persisted game is already lost, we transition to the LOST state.',
          target: 'LOST',
          guard: 'isLost',
        },
        {
          description:
            'If the board is neither won or lost, we transition to the PLAYING state.',
          target: 'PLAYING',
        },
      ],
    },
    PLAYING: {
      on: {
        move: {
          description:
            'While playing, the player can move tiles around. Notice that there is also a global reset action that applies here as well.',
          target: 'MOVING',
          actions: 'move',
        },
      },
    },
    MOVING: {
      always: {
        description:
          'Transition to PLAYING state unless the board was updated.',
        target: 'PLAYING',
        guard: 'isNotUpdated',
      },
      after: {
        '60': {
          description:
            'If tiles were moved, then we should merge overlapping tiles and transition to the SPAWNING state.',
          // The delay is there to allow spawning animation and moving animation from colliding.
          // I wanna improve this, tbh. :(
          // It's not bad design. It's just makes the game not as snappy as it could possibly be.
          target: 'SPAWNING',
          actions: 'merge',
        },
      },
    },
    SPAWNING: {
      entry: ['add', 'persist'],
      always: {
        target: 'CHECKING',
      },
    },
    WON: {
      entry: 'win',
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
      target: '.PLAYING',
      actions: 'reset',
    },
  },
})
