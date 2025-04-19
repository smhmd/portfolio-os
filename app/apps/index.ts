import { metadata as _2048 } from './2048/metadata'
import { metadata as camera } from './camera/metadata'
import { metadata as drumMachine } from './drum-machine/metadata'
import { metadata as files } from './files/metadata'
import { metadata as gallery } from './gallery/metadata'
import { metadata as magnetize } from './magnetize/metadata'
import { metadata as radio } from './radio/metadata'
import { metadata as typingTest } from './typing-test/metadata'

export const apps = {
  camera,
  files,
  gallery,
  radio,
  '2048': _2048,
  'typing-test': typingTest,
  'drum-machine': drumMachine,
  magnetize,
}

export type AppID = keyof typeof apps
export type AppGridArray = Array<AppID | [string, AppID[]]>

export const appIDs = Object.keys(apps) as AppID[]

export const appGrid: AppGridArray = [
  '2048',
  'magnetize',
  'drum-machine',
  'typing-test',
]
