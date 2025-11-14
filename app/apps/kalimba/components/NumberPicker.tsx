import { useState } from 'react'

import clsx from 'clsx'
import { Slider } from 'radix-ui'

import type { Props } from '~/lib'

import { Control } from './Control'

type NumberPickerProps = Props<
  typeof Slider.Root,
  { value: number; name: string; formatValue?(value: number): number | string }
>

export function NumberPicker({
  name,
  value,
  formatValue = (v) => v,
  onValueChange,
  ...props
}: NumberPickerProps) {
  const [innerValue, setInnerValue] = useState(value)
  return (
    <Control name={name} value={formatValue(value)}>
      <div className='flex items-center justify-center gap-x-4'>
        <Slider.Root
          className='group relative flex h-6 grow touch-none items-center justify-between'
          defaultValue={[value]}
          onValueChange={([v]) => {
            setInnerValue(v)
            onValueChange?.([v])
          }}
          {...props}>
          <Slider.Track className='h-6.5 relative grow rounded-full bg-white/30' />
          <Slider.Thumb
            autoFocus
            id={`slider-${name}`}
            className={clsx(
              'size-13 relative block rounded-full bg-white',
              'shadow-inner-xl shadow-neutral-400',
              'cursor-grab active:cursor-grabbing',
              'hover:shadow-none focus:outline-none group-focus-within:shadow-none',
            )}
            aria-label='Volume'
          />
        </Slider.Root>
        <output
          htmlFor={`slider-${name}`}
          className='mb-0.75 min-w-[4.5ch] text-right font-semibold tabular-nums'>
          {formatValue(innerValue)}
        </output>
      </div>
    </Control>
  )
}
