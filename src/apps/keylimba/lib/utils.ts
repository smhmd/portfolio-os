import { clamp, isEven } from 'src/lib/math'

import {
  type NoteKey,
  optionConfig,
  type Options,
  scales,
  type TineInfo,
} from './common'

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

const options = Object.keys(optionConfig) as (keyof Options)[]

export function parseOptions(data?: string): Options {
  const nums = data?.split(',').map(Number) ?? []
  const ok = nums.length === options.length && nums.every(Number.isFinite)

  return Object.fromEntries(
    options.map((key, i) => {
      const { init, min, max } = optionConfig[key]
      return [key, ok ? clamp(min, nums[i], max) : init]
    }),
  ) as Options
}

export const serializeOptions = (o: Options) => {
  return options.map((k) => o[k]).join(',')
}
