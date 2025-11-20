import clsx from 'clsx'
import { RadioGroup } from 'radix-ui'

import type { Props } from 'app/lib'

import { Control } from './Control'
import { Token } from './Token'

type ColorPickerProps = Props<
  typeof RadioGroup.Root,
  { options: string[]; name: string; value: number }
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
        options[value],
      )}>
      <RadioGroup.Root
        defaultValue={value.toString()}
        className='@container grid grid-cols-6 grid-rows-3 place-items-center gap-2.5'
        {...props}>
        {options.map((color, i) => (
          <RadioGroup.Item
            key={color}
            value={i.toString()}
            aria-label={color}
            asChild>
            <Token className={color} />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Control>
  )
}
