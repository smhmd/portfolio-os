import { assign, fromPromise, setup } from 'xstate'

import { decode } from 'app/lib/torrent-tools/bencode'
import { torrentToMagnetObject } from 'app/lib/torrent-tools/torrent'
import type { MagnetObject, TorrentObject } from 'app/lib/torrent-tools/types'

import { FILE_LIMIT, type Options } from './common'
import { indexesToRange, magnetToMagnetURI } from './utils'

type Events =
  | { type: 'torrent.add'; payload: string | ArrayBuffer }
  | { type: 'option.set'; payload: { option: keyof Options; value: boolean } }
  | { type: 'selectedFiles.set'; payload: Set<number> }
  | { type: 'reset' }

export type State = {
  torrentObject?: TorrentObject
  magnetObject?: MagnetObject
  magnetURI?: string
  options: Options
  selectedFiles?: string
  error?: Error
}

const initialState = {
  torrentObject: undefined,
  magnetObject: undefined,
  magnetURI: undefined,
  error: undefined,
  options: {
    includeName: true,
    includeLength: true,
    includeTracker: true,
    includeMultiTrackers: false,
  },
  selectedFiles: undefined,
} satisfies State

export const compareState = (a: State, b: State) => a.magnetURI === b.magnetURI

export const machine = setup({
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
      if (!torrentObject) throw new Error('This is an impossible state.')
      return await torrentToMagnetObject(torrentObject)
    }),
  },
}).createMachine({
  id: 'magnetize',
  context: initialState,
  initial: 'IDLE',
  states: {
    IDLE: {},
    LOADING: {
      invoke: {
        src: 'convertTorrentToMagnet',
        input: ({ context }) => ({ torrentObject: context.torrentObject }),
        onDone: {
          target: 'LOADED',
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
      },
    },
    LOADED: {
      on: {
        'option.set': {
          actions: assign(({ context, event }) => {
            const { option, value } = event.payload
            const newOptions = { ...context.options, [option]: value }

            if (!context.magnetObject)
              throw new Error('This is an impossible state')

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
        'selectedFiles.set': {
          guard: ({ context: { torrentObject } }) => {
            if (!torrentObject) return false
            if (!('files' in torrentObject.info)) return false
            if (torrentObject.info.files.length > FILE_LIMIT) return false
            return true
          },
          actions: assign(({ context, event }) => {
            const selectedIndexes = event.payload

            if (!context.magnetObject)
              throw new Error('This is an impossible state')

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
    'torrent.add': {
      target: '.LOADING',
      actions: assign({
        torrentObject: ({ event }) => decode(event.payload) as TorrentObject,
      }),
    },
    reset: {
      target: '.IDLE',
      actions: assign(() => initialState),
    },
  },
})
