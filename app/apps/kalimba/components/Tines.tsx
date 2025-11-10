import { useMemo } from 'react'

import clsx from 'clsx'

import { useGlobals } from '~/contexts'
import type { Props } from '~/lib'
import { interpolate } from '~/utils'

import { MAX_COUNT, MIN_COUNT, useOptions } from '../lib'
import { Tine } from './Tine'

type TinesProps = Props<
  'div',
  {
    count?: number
    height?: number
    diff?: number
  }
>

const TOTAL_HEIGHT = 100

export function Tines({ className, ...props }: TinesProps) {
  const { options } = useOptions()
  const { width } = useGlobals()

  const { min, max } = useMemo(
    () => ({
      min: interpolate(width, [400, 1800], [22, 40]),
      max: interpolate(width, [400, 1800], [30, 60]),
    }),
    [width],
  )

  const { tines, padding } = useMemo(() => {
    // calculate padding based on both the tines count and the screen width
    const padding = interpolate(
      options.tines,
      [MIN_COUNT, MAX_COUNT],
      [1, 0.2],
      'ease-out',
    ).toFixed(1)

    const diff = interpolate(
      options.tines,
      [MIN_COUNT, MAX_COUNT],
      [min, max],
      (t) => 1 - Math.pow(1 - t, 3),
    )

    const tines = getTines(options.tines).map((tine) => ({
      ...tine,
      height: Math.floor(TOTAL_HEIGHT - diff * tine.factor),
    }))

    return { tines, padding }
  }, [options.tines, width])

  return (
    <div
      className={clsx('flex size-full justify-around', className)}
      {...props}>
      {tines.map(({ height, note, octave, num }, i) => (
        <Tine
          index={i}
          key={`${note}${octave}${num}`}
          num={num}
          octave={octave}
          note={note}
          padding={padding}
          height={height}
        />
      ))}
    </div>
  )
}

const BASE_TINES = [
  { num: 6, octave: 6, note: 'A' },
  { num: 4, octave: 6, note: 'F' },
  { num: 2, octave: 6, note: 'D' },
  { num: 7, octave: 5, note: 'B' },
  { num: 5, octave: 5, note: 'G' },
  { num: 3, octave: 5, note: 'E' },
  { num: 1, octave: 5, note: 'C' },
  { num: 6, octave: 4, note: 'A' },
  { num: 4, octave: 4, note: 'F' },
  { num: 2, octave: 4, note: 'D' },
  { num: 1, octave: 4, note: 'C' },
  { num: 3, octave: 4, note: 'E' },
  { num: 5, octave: 4, note: 'G' },
  { num: 7, octave: 4, note: 'B' },
  { num: 2, octave: 5, note: 'D' },
  { num: 4, octave: 5, note: 'F' },
  { num: 6, octave: 5, note: 'A' },
  { num: 1, octave: 6, note: 'C' },
  { num: 3, octave: 6, note: 'E' },
  { num: 5, octave: 6, note: 'G' },
  { num: 7, octave: 6, note: 'B' },
]

function getTines(length: number) {
  const total = BASE_TINES.length
  const pad = (total - length) / 2
  const center = (length - 1) / 2
  const slice = BASE_TINES.slice(Math.floor(pad), total - Math.ceil(pad))

  return slice.map((tine, i) => {
    const dist = i - center
    const factor =
      Math.log1p((4 * Math.abs(dist)) / center) / Math.LN10 +
      (dist > 0 ? 0.02 : -0.06)
    return { ...tine, factor: dist === 0 ? 0 : factor }
  })
}
