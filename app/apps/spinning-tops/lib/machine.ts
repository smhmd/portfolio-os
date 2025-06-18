import { assign, createActor, setup } from 'xstate'

import { APP_ID, difficulties, type PlayerID, type State } from './common'

type Events =
  | { type: 'game.countdown' }
  | { type: 'game.start' }
  | { type: 'game.menu' }
  | { type: 'difficulty.cycle' }
  | { type: 'player.lose'; payload: PlayerID }
  | { type: 'player.winner.clear' }

const initialContext = {
  difficulty: 0,
  winner: null,
} satisfies State

const machine = setup({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  actions: {
    cycleDifficulty: assign(({ context }) => ({
      difficulty: (context.difficulty + 1) % difficulties.length,
    })),
    setWinner: assign(({ event }) => {
      if (event.type != 'player.lose') return {}
      const winner: PlayerID = event.payload === 'me' ? 'cpu' : 'me'
      return { winner }
    }),
    clearWinenr: assign({ winner: null }),
  },
}).createMachine({
  id: APP_ID,
  initial: 'MAIN_MENU',
  context: initialContext,
  states: {
    MAIN_MENU: {
      on: {
        'game.countdown': { target: 'COUNTDOWN' },
        'difficulty.cycle': { actions: 'cycleDifficulty' },
      },
    },
    COUNTDOWN: {
      entry: 'clearWinenr',
      on: {
        'game.start': { target: 'PLAYING' },
      },
    },
    PLAYING: {
      on: {
        'player.lose': { actions: 'setWinner', target: 'GAME_OVER' },
      },
    },
    GAME_OVER: {
      on: {
        'game.menu': { target: 'MAIN_MENU' },
        'game.countdown': { target: 'COUNTDOWN' },
      },
    },
  },
})

export const actor = createActor(machine)
actor.start()
