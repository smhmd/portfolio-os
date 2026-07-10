import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import clsx from 'clsx'

import { isDesktop } from 'src/lib/env'
import type { Props } from 'src/lib/types'

import type { colors } from '../lib'
import { Control } from './Control'
import { Token } from './Token'

type ColorPickerProps = Props<
  typeof RadioGroup,
  { options: typeof colors; name: string; value: number }
>

export function StylePicker({
  name,
  value,
  options,
  ...props
}: ColorPickerProps) {
  return (
    <Control
      name={name}
      className={clsx(
        'block size-full',
        'rounded-full',
        isDesktop && 'corner-squircle',
        'init:bg-cover bg-[#111]',
        options[value].img,
      )}>
      <RadioGroup
        value={value.toString()}
        className='@container grid grid-cols-6 grid-rows-3 place-items-center gap-2.5'
        {...props}>
        {options.map((color, i) => (
          <Radio.Root
            key={color.img}
            id={color.img}
            value={i.toString()}
            aria-label={color.bg}
            className='group outline-none'>
            <Token className={clsx('init:bg-cover bg-[#111]', color.img)} />
          </Radio.Root>
        ))}
      </RadioGroup>
    </Control>
  )
}
