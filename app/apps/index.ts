import { metadata as _2048 } from './2048/metadata'
import { metadata as diceRoll } from './dice-roll/metadata'
import { metadata as drumMachine } from './drum-machine/metadata'
import { metadata as magnetize } from './magnetize/metadata'
import { metadata as spinningTops } from './spinning-tops/metadata'
import { metadata as typingTest } from './typing-test/metadata'

export const apps = {
  '2048': _2048,
  'drum-machine': drumMachine,
  magnetize,
  'dice-roll': diceRoll,
  'spinning-tops': spinningTops,
  'typing-test': typingTest,
}

export type AppID = keyof typeof apps
export type AppGridArray = Array<AppID | [string, AppID[]]>

export const appIDs = Object.keys(apps) as AppID[]

export const appGrid: AppGridArray = [
  '2048',
  'dice-roll',
  'drum-machine',
  'magnetize',
  'spinning-tops',
  'typing-test',
]
