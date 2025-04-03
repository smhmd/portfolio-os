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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAYgCc4wAXAbQAYBdRUABwHtZcrc39mQAHogCMANgBM4gHQAOACziAnHQCsw9SroB2ADQgAnohUzFUlVvPCti4XXEy6igL5O9aLHkJEpASQAiADIAoiSwVOhktIz87JzcvPxCCADMMtJ0csLJyaJaFiqionqGCDIywlI2Wrl0oiqK+ckubhg4BMRSAMIAEkGdANI+AHIA4iT0TEggsVw8fFNJFnJS2ioq9uXCag3FiFriWlLqiuJiojKiVloyzSDubV5dvQPDYzTCk6wcswkLeyrLVaWGRqTSKGS7UpyFRmRT1cQAxRyMrCW73TwdHp9QajcbiT7Tb7xeagRYAlb5LTCEFbRwQgyIRQSWRyRTKOHyNLGNGtDHeAAKAQAggBNV4kVBsABuYAmMSJc0SiBk+zM1XEcjy4IydGEkLkmqOxmR6lyhVOoh5Hna3gAsgB5ABq4rlUxmxKVCCyyUOVOp8jkySRGkhSkOMlSNlE2gkEgBVoeHQdztxAjC6CoYCk6AAZpmyMho6R0TapMnXq6vnFFX8UmkVplktTjEDdAyEOJRMscuJUk2tgjagm+VIAMr8oUAdSGLuiboVv1JRg1lXB2WEDTyuTbJUKh0khRMJsuomcrjuvNLk-tQxImF43HwAFdZXOqz8SYIRNlRA3shrynkDJIQsOgpByE4EXBU4fTkFxz3wNgIDgfgSy8eVq0XL8OwNWRLjkOh-zWXVrkhLJpB7VJVHEWpUi0YdS38YIMI-T0lGkC5hAIojNGpSFFGSMCgwUJtdVEQTdQYx4sReUYWI9WtNGScCTDoDJzC7A0d3+ITT0keo0iyLQ4PPNCOkFUVXnkmsly9OQ6lXLQMns7YjMhcTDmo+xqWqYy0ikpMnSs+dMM-JJbDsMwDThVZbGScRIXiio6DKJESLUtIblMy9HnHKcZzkkLWNrZEYWUez1AOVIVT1dt1jApQGnKAoLnkVFsutR5ryGaysPCqwZEqZJWSpbQyl1FQQM7PCTgIkSmwuALvACe1RwAFV6sKRBo38rHioNjB9JR6RKVqWXqLICi7a4zxcIA */
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
          description: 'While playing, the player can move tiles around.',
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
      description:
        'Transition directly to the playing state with 2 starting tiles.',
      target: '.PLAYING',
      actions: 'reset',
    },
  },
})
