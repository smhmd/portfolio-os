import { assign, createActor, fromPromise, setup } from 'xstate'

import type { API } from 'app/lib'

import {
  bencode,
  type MagnetObject,
  torrent,
  type TorrentObject,
} from './bencode'
import { APP_ID, type Options } from './common'
import { indexesToRange, magnetToMagnetURI } from './utils'

type Events =
  | { type: 'file.upload'; payload: string | ArrayBuffer }
  | { type: 'option.set'; payload: { option: keyof Options; value: boolean } }
  | { type: 'files.select'; payload: Set<number> }
  | { type: 'reset' }

export type State = {
  torrentObject?: TorrentObject
  magnetObject?: MagnetObject
  magnetURI?: string
  options: Options
  selectedFiles?: string
  error?: boolean
}

const initialState = {
  torrentObject: undefined,
  magnetObject: undefined,
  magnetURI: undefined,
  options: {
    includeName: true,
    includeLength: true,
    includeTracker: true,
    includeMultiTrackers: false,
  },
  selectedFiles: undefined,
  error: false,
} satisfies State

const errorState = {
  ...initialState,
  error: true,
} satisfies State

/**
 * Will prompt useSelector to update the state when this is false
 * We return `false` when `magnetURI` or `error` don't match the previous state
 */
export const compareState = (a: State, b: State) => {
  return a.magnetURI === b.magnetURI && a.error === b.error
}

const machine = setup({
  types: {
    context: {} as State,
    events: {} as Events,
  },
  actions: {},
  guards: {},
  actors: {
    convertTorrentToMagnet: fromPromise<
      MagnetObject,
      Pick<State, 'torrentObject'>
    >(async ({ input: { torrentObject } }) => {
      if (!torrentObject) throw new Error('IMPOSSIBLE_STATE_REACHED')
      return await torrent.torrentToMagnetObject(torrentObject)
    }),
  },
}).createMachine({
  id: APP_ID,
  context: initialState,
  initial: 'IDLE',
  states: {
    IDLE: {
      description:
        'Initial state. No action has been taken yet. The user has not added a torrent.',
    },
    LOADING: {
      description:
        'Process and convert a torrent object to a magnet object/URI.',
      invoke: {
        src: 'convertTorrentToMagnet',
        input: ({ context }) => ({ torrentObject: context.torrentObject }),
        onDone: {
          target: 'LOADED',
          description:
            'Transition to LOADED state when the torrent has been successfully converted to a magnet object/URI.',
          actions: assign(({ context, event }) => {
            return {
              magnetObject: event.output,
              magnetURI: magnetToMagnetURI({
                magnet: event.output,
                options: context.options,
                selectedFiles: context.selectedFiles,
              }),
            }
          }),
        },
        onError: {
          description:
            'Update the state to have an error if the conversion fails.',
          actions: assign(errorState),
        },
      },
    },
    LOADED: {
      description:
        'State where the torrent has been successfully converted to a magnet URI. User can update options and selected files.',
      on: {
        'option.set': {
          description: 'Update the options and regenerates the magnet URI.',
          actions: assign(({ context, event }) => {
            const { option, value } = event.payload
            const newOptions = { ...context.options, [option]: value }

            if (!context.magnetObject)
              throw new Error('IMPOSSIBLE_STATE_REACHED')

            const newMagnetURI = magnetToMagnetURI({
              magnet: context.magnetObject,
              options: newOptions,
              selectedFiles: context.selectedFiles,
            })

            return {
              options: newOptions,
              magnetURI: newMagnetURI,
            }
          }),
        },
        'files.select': {
          description:
            'Update the selected files and regenerates the magnet URI.',
          guard: ({ context: { torrentObject } }) => {
            if (!torrentObject) return false
            if (!('files' in torrentObject.info)) return false
            return true
          },
          actions: assign(({ context, event }) => {
            const selectedIndexes = event.payload

            if (!context.magnetObject)
              throw new Error('IMPOSSIBLE_STATE_REACHED')

            const newSelectedFiles = indexesToRange(selectedIndexes)

            const newMagnetURI = magnetToMagnetURI({
              magnet: context.magnetObject,
              options: context.options,
              selectedFiles: newSelectedFiles,
            })

            return {
              selectedFiles: newSelectedFiles,
              magnetURI: newMagnetURI,
            }
          }),
        },
      },
    },
  },
  on: {
    'file.upload': {
      description:
        'Decode the torrent file and generate a torrent object to be processed.',
      target: '.LOADING',
      actions: assign(({ event }) => {
        try {
          const torrentObject = bencode.decode(event.payload) as TorrentObject
          return { torrentObject, selectedFiles: undefined, error: undefined }
        } catch (e) {
          console.error(e)
        }
        return errorState
      }),
    },
    reset: {
      description: 'Reset the state machine to the initial state/context.',
      target: '.IDLE',
      actions: assign(initialState),
    },
  },
})

export const actor = createActor(machine)
export const api = {
  uploadFile(payload) {
    actor.send({ type: 'file.upload', payload })
  },
  setOption(payload) {
    actor.send({ type: 'option.set', payload })
  },
  selectFiles(payload) {
    actor.send({ type: 'files.select', payload })
  },
  reset() {
    actor.send({ type: 'reset' })
  },
} satisfies API<Events>

actor.start()
