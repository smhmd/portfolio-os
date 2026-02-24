import { assign, createMachine } from 'xstate'

import { destination, synth } from 'src/lib'

import { APP_ID } from './common'

type State = {
  volume: number
}
type Events =
  | { type: 'CHANGE_VOLUME'; payload: number }
  | { type: 'ATTACK_NOTE'; payload: string }
  | { type: 'RELEASE_NOTE' }

export const machine = createMachine({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  id: APP_ID,
  initial: 'IDLE',
  context: {
    volume: 0,
  },
  states: {
    IDLE: {},
  },
  on: {
    CHANGE_VOLUME: {
      actions: assign(({ event }) => {
        destination.volume.rampTo(destination.volume.value + event.payload, 0.1)
        return { volume: Math.round(destination.volume.value) }
      }),
    },
    ATTACK_NOTE: {
      actions: ({ event }) => {
        synth?.triggerAttack(event.payload)
      },
    },
    RELEASE_NOTE: {
      actions: () => {
        synth?.triggerRelease()
      },
    },
  },
})
