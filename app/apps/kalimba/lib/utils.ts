import { isEven } from 'app/utils'

import { type NoteKey, scales, type TineInfo } from './common'

const scaleSize = 7
const tinesCache = new Map<string, TineInfo[]>()

export function getTines(key: NoteKey = 'C', base: number = 4): TineInfo[] {
  const cacheKey = `${key}_${base}`
  if (tinesCache.has(cacheKey)) return tinesCache.get(cacheKey)!

  const scale = scales[key]
  let octave = base

  const tines = Array.from({ length: scaleSize * 3 }, (_, i) => {
    let num = i % scaleSize
    const pips = Math.floor(i / scaleSize)
    const note = scale[num++]

    if (key === 'Gb') {
      // for Gb minor scale, the octave jump happens on Db
      if (i > 0 && note === 'Db') octave++
    } else {
      // each time we encounter a C, we raise the octave
      // unless the first note is C, which makes us in C major
      if (i > 0 && note.startsWith('C')) octave++
    }

    return { num, pips, note, octave }
  })

  tinesCache.set(cacheKey, tines)
  return tines
}

export function getTineOrder(index: number) {
  if (index == 0) return 0
  const n = Math.ceil(index / 2)
  return isEven(index) ? n : -n
}
