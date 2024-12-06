import { metadata as _2048 } from './2048'
import { metadata as camera } from './camera'
import { metadata as files } from './files'
import { metadata as gallery } from './gallery'
import { metadata as radio } from './radio'

export const apps = {
  camera,
  files,
  gallery,
  radio,
  '2048': _2048,
}

export type AppID = keyof typeof apps
