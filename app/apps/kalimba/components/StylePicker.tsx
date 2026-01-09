import clsx from 'clsx'
import { RadioGroup } from 'radix-ui'

import type { Props } from 'app/lib'

import type { colors } from '../lib'
import { Control } from './Control'
import { Token } from './Token'

type ColorPickerProps = Props<
  typeof RadioGroup.Root,
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
        'corner-squircle block size-full rounded-full',
        options[value].img,
        'init:bg-cover init:bg-[#111]',
      )}>
      <RadioGroup.Root
        defaultValue={value.toString()}
        className='@container grid grid-cols-6 grid-rows-3 place-items-center gap-2.5'
        {...props}>
        {options.map((color, i) => (
          <RadioGroup.Item
            key={color.img}
            value={i.toString()}
            aria-label={color.bg}
            asChild>
            <Token
              className={clsx(color.img, 'init:bg-cover init:bg-[#111]')}
            />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Control>
  )
}
