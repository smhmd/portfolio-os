import { Texture } from 'three'

import { clientOnly } from 'app/lib'

export const APP_ID = 'kalimba'

export type Options = {
  color: number
  labelType: number
  tines: number
  tuning: number
  reverb: number
}

export const MIN_COUNT = 9
export const MAX_COUNT = 21

export const ZOOM = 100
export const PADDING = 0.015

export const ROTATION_X = 0.6
export const ROTATION_Y = 0.3
export const ROTATION_Z = 0.2

export const KALIMBA_SAMPLE = {
  sample: '/kalimba/samples/kalimba.ogg',
  freq: 261.3,
  min: 3,
  max: 7,
}

export type TineInfo = {
  num: number
  pips: number
  octave: number
  note: string
}

export const colors = [
  {
    img: 'wp-[slanted-gradient.svg] bg-top',
    text: 'text-red-900/50',
    bg: 'to-red-100',
  },
  {
    img: 'wp-[geometric-intersection.svg] bg-center',
    text: 'text-amber-900/50',
    bg: 'to-amber-100',
  },
  {
    img: 'wp-[liquid-cheese.svg] bg-bottom',
    text: 'text-yellow-800/50',
    bg: 'to-yellow-100',
  },
  {
    img: 'wp-[abstract-envelope.svg] bg-bottom',
    text: 'text-emerald-900/50',
    bg: 'to-emerald-100',
  },
  {
    img: 'wp-[ocean-waves.svg] bg-center',
    text: 'text-blue-900/50',
    bg: 'to-blue-100',
  },
  {
    img: 'wp-[dragon-scales.svg] bg-contain',
    text: 'text-purple-900/50',
    bg: 'to-purple-100',
  },
  {
    img: 'wp-[rose-petals.svg] bg-bottom',
    text: 'text-rose-900/50',
    bg: 'to-rose-100',
  },

  {
    img: 'wp-[sun-tornado.svg] bg-bottom',
    text: 'text-orange-800/50',
    bg: 'to-orange-100',
  },

  {
    img: 'wp-[radiant-gradient.svg] bg-center',
    text: 'text-lime-900/50',
    bg: 'to-lime-100',
  },
  {
    img: 'wp-[subtle-prism.svg] bg-bottom bg-contain',
    text: 'text-cyan-900/50',
    bg: 'to-cyan-100',
  },
  {
    img: 'wp-[endless-constellation.svg] bg-auto',
    text: 'text-indigo-900/50',
    bg: 'to-indigo-100',
  },
  {
    img: 'wp-[diamond-sunset.svg] bg-center',
    text: 'text-fuchsia-900/50',
    bg: 'to-fuchsia-100',
  },
  {
    img: 'wp-[quantum-gradient.svg] bg-center',
    text: 'text-pink-800/50',
    bg: 'to-pink-100',
  },
  {
    img: 'wp-[parabolic-ellipse.svg] bg-center',
    text: 'text-red-900/50',
    bg: 'to-red-100',
  },
  {
    img: 'wp-[tortoise-shell.svg] bg-auto',
    text: 'text-emerald-900/50',
    bg: 'to-emerald-100',
  },
  {
    img: 'wp-[flat-mountains.svg] bg-bottom',
    text: 'text-teal-900/50',
    bg: 'to-teal-100',
  },
  {
    img: 'wp-[bullseye-gradient.svg] bg-center',
    text: 'text-violet-900/50',
    bg: 'to-violet-100',
  },
  {
    img: 'wp-[cornered-stairs.svg] bg-center',
    text: 'text-neutral-900/50',
    bg: 'to-neutral-100',
  },
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

export const SMILE_TEXTURE = clientOnly(() => {
  const image = new Image()
  image.src =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NDAiIGhlaWdodD0iNTQwIiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgNTQwIDU0MCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTM4NS4xIDIzNC44Yy0xNS45IDAtMjYuNS0yNy4yLTE1LjQtMzkuNSA2LjgtNy41IDE1LTYuOSAyMy43IDEuOSAxMi43IDEyLjcgNy4zIDM3LjYtOC4zIDM3LjZNMTQzLjEgMjI3LjRjLTUuMi04LTMuOC0xNy42IDQtMjYuNCA5LjgtMTEuMSAyNy43LTIgMjcuNyAxNC4yIDAgMTguMS0yMi4yIDI2LjYtMzEuNyAxMi4yTTI2NS45IDM0OC41YzI5LjggMCA1Mi4zLTEwLjUgNzMuOC0zOCA2LjItNy43IDExLjktMTIuNiAxOC40LTYgNi44IDYuNyA3LjYgMTMuNi0yLjQgMjkuMy0xNS4zIDI0LjEtNTQuNCA0NS4zLTg5IDQ1LjZhNzQgNzQgMCAwIDEtNDAuNi0xMGMtMjEuMi0xMC42LTQ3LjMtMzUuNS01MS4zLTQ4LTIuMy03LjMgNC0xOCAxMS40LTE4IDIuMyAwIDE0IDkuNSAyMCAxNi4yIDE0LjQgMTYgNDIuNSAyOC45IDU5LjcgMjguOSIvPjwvc3ZnPg=='
  const texture = new Texture(image)
  texture.needsUpdate = true

  return texture
})
