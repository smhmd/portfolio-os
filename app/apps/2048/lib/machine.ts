import { useMachine } from '@xstate/react'
import { assign, setup } from 'xstate'

import type { Direction, State } from './common'
import { addTile, checkLost, mergeTiles, moveTiles } from './utils'

type Events =
  | { type: 'move'; payload: Direction }
  | { type: 'reset' }
  | { type: 'continue' }

const machine = setup({
  types: {
    context: {} as State & { previousState: State | null },
    events: {} as Events,
  },
}).createMachine({
  context: {
    board: [
      { id: '69bb714a-8d8d-4b6a-8fef-76ccfef78fb8', x: 0, y: 1, value: 2 },
      { id: 'f605e97c-7302-40e8-94fa-d51c4d6860dc', x: 0, y: 2, value: 2 },
    ],
    score: 0,
    moved: false,
    previousState: null,
  },
  id: '2048',
  description: 'The state machine for the game 2048.',
  initial: 'INIT',
  states: {
    INIT: {
      always: {
        target: 'START',
      },
    },
    START: {
      always: [
        {
          target: 'LOST',
          guard: ({ context }) => {
            return checkLost(context.board)
          },
        },
        {
          target: 'PLAYING',
          // actions: assign({
          //   board: addTile(addTile([])),
          // }),
        },
      ],
    },
    PLAYING: {
      on: {
        move: {
          target: 'MOVING',
          actions: assign(({ context, event }) =>
            moveTiles(context.board, event.payload),
          ),
        },
      },
    },
    MOVING: {
      after: {
        '0': {
          // If no tiles were moved, go to PLAYING state
          target: 'PLAYING',
          guard: ({ context }) => !context.moved,
        },
        '200': {
          //  If any tiles were moved, go to SPAWNING state (after 200ms)
          target: 'SPAWNING',
          actions: assign(({ context }) =>
            mergeTiles(context.board, context.score),
          ),
          guard: ({ context }) => context.moved,
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
      always: [
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
        reset: {
          target: 'START',
        },
        continue: {
          target: 'PLAYING',
        },
      },
    },
    LOST: {
      on: {
        reset: {
          target: 'START',
        },
      },
    },
  },
})

export const useGameMachine = () => useMachine(machine)
