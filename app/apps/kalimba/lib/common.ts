import { Texture } from 'three'

import { isClient } from '~/lib'

export const APP_ID = 'kalimba'

export const MIN_COUNT = 9
export const MAX_COUNT = 21

export const FOV = 20
export const DISTANCE = 10
export const PADDING = 1.05

export const ROTATION_X = 0.6
export const ROTATION_Y = 0.3
export const ROTATION_Z = 0.2

export const KALIMBA_SOUNDS = {
  samples: [
    { src: '/kalimba/samples/kalimba262.ogg', freq: 261.3 }, // C4
    { src: '/kalimba/samples/kalimba523.ogg', freq: 523.1 }, // C5
    { src: '/kalimba/samples/kalimba1056.ogg', freq: 1055.8 }, // C6
  ],
  octaves: { min: 3, max: 7 },
}

export type TineInfo = {
  num: number
  pips: number
  octave: number
  note: string
}

export const colors = [
  'bg-red-500 text-red-900/50',
  'bg-orange-400 text-orange-800/50',
  'bg-emerald-500 text-emerald-900/50',
  'bg-teal-500 text-teal-900/50',
  'bg-blue-500 text-blue-900/50',
  'bg-purple-500 text-purple-900/50',
  'bg-rose-500 text-rose-900/50',
  'bg-amber-500 text-amber-900/50',
  'bg-green-500 text-green-900/50',
  'bg-cyan-500 text-cyan-900/50',
  'bg-indigo-500 text-indigo-900/50',
  'bg-fuchsia-500 text-fuchsia-900/50',
  'bg-pink-500 text-pink-800/50',
  'bg-yellow-400 text-yellow-800/50',
  'bg-lime-400 text-lime-900/50',
  'bg-sky-500 text-sky-900/50',
  'bg-violet-500 text-violet-900/50',
  'bg-zinc-300 text-neutral-900/50',
]

export const labels = ['1', 'c', '1\nc']

export const scales = {
  Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
  A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
  B: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  Db: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
  D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
  Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
  E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
  F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
  Gb: ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F'],
  G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
}

export type NoteKey = keyof typeof scales

export const tunings: NoteKey[] = [
  'Ab',
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
]

export const keyboardKeys = [
  // low octave
  'KeyB',
  'KeyV',
  'KeyN',
  'KeyC',
  'KeyM',
  'KeyX',
  'Comma',

  // middle octave
  'KeyH',
  'KeyG',
  'KeyJ',
  'KeyF',
  'KeyK',
  'KeyD',
  'KeyL',

  // high octave
  'KeyY',
  'KeyT',
  'KeyU',
  'KeyR',
  'KeyI',
  'KeyE',
  'KeyO',
]

export let SMILE_TEXTURE: Texture | undefined = undefined

if (isClient) {
  const image = new Image()
  image.src =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NDAiIGhlaWdodD0iNTQwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgNTQwIDU0MCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM4NS4xIDIzNC44Yy0xNS45IDAtMjYuNS0yNy4yLTE1LjQtMzkuNSA2LjgtNy41IDE1LTYuOSAyMy43IDEuOSAxMi43IDEyLjcgNy4zIDM3LjYtOC4zIDM3LjZNMTQzLjEgMjI3LjRjLTUuMi04LTMuOC0xNy42IDQtMjYuNCA5LjgtMTEuMSAyNy43LTIgMjcuNyAxNC4yIDAgMTguMS0yMi4yIDI2LjYtMzEuNyAxMi4yTTI2NS45IDM0OC41YzI5LjggMCA1Mi4zLTEwLjUgNzMuOC0zOCA2LjItNy43IDExLjktMTIuNiAxOC40LTYgNi44IDYuNyA3LjYgMTMuNi0yLjQgMjkuMy0xNS4zIDI0LjEtNTQuNCA0NS4zLTg5IDQ1LjZhNzQgNzQgMCAwIDEtNDAuNi0xMGMtMjEuMi0xMC42LTQ3LjMtMzUuNS01MS4zLTQ4LTIuMy03LjMgNC0xOCAxMS40LTE4IDIuMyAwIDE0IDkuNSAyMCAxNi4yIDE0LjQgMTYgNDIuNSAyOC45IDU5LjcgMjguOSIvPjwvc3ZnPg=='
  SMILE_TEXTURE = new Texture(image)
  SMILE_TEXTURE.needsUpdate = true
}
