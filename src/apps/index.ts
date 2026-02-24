import { metadata as _2048 } from './2048/metadata'
import { metadata as aboutMe } from './about-me/metadata'
import { metadata as diceRoll } from './dice-roll/metadata'
import { metadata as kalimba } from './kalimba/metadata'
import { metadata as magnetize } from './magnetize/metadata'
import { metadata as monumentValley } from './monument-valley/metadata'
import { metadata as drumMachine } from './music-workstation/metadata'
import { metadata as spinningTops } from './spinning-tops/metadata'
import { metadata as typingTest } from './typing-test/metadata'

export const apps = {
  '2048': _2048,
  'about-me': aboutMe,
  'dice-roll': diceRoll,
  kalimba: kalimba,
  magnetize,
  'monument-valley': monumentValley,
  'music-workstation': drumMachine,
  'spinning-tops': spinningTops,
  'typing-test': typingTest,
}

export type AppID = keyof typeof apps
export type AppGridArray = Array<AppID | [string, AppID[]]>

export const appIDs = Object.keys(apps) as AppID[]

export const appGrid: AppGridArray = [
  'about-me',
  '2048',
  'kalimba',
  'magnetize',
  'spinning-tops',
  'typing-test',
  'dice-roll',
  'music-workstation',
  'monument-valley',
]
