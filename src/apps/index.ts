import { metadata as _2048 } from './2048/metadata'
import { metadata as aboutMe } from './about-me/metadata'
import { metadata as diceRoll } from './dice-roll/metadata'
import { metadata as keylimba } from './keylimba/metadata'
import { metadata as magnetize } from './magnetize/metadata'
import { metadata as monumentValley } from './monument-valley/metadata'
import { metadata as musicWorkstation } from './music-workstation/metadata'
import { metadata as spinningTops } from './spinning-tops/metadata'

export const apps = {
  '2048': _2048,
  'about-me': aboutMe,
  'dice-roll': diceRoll,
  keylimba,
  magnetize,
  'monument-valley': monumentValley,
  'spinning-tops': spinningTops,
  'music-workstation': musicWorkstation,
}

export type AppID = keyof typeof apps
export type AppGridArray = Array<AppID | [string, AppID[]]>

export const appIDs = Object.keys(apps) as AppID[]

export const appGrid: AppGridArray = [
  '2048',
  'about-me',
  'dice-roll',
  'magnetize',
  'keylimba',
  'monument-valley',
  'spinning-tops',
  'music-workstation',
]
