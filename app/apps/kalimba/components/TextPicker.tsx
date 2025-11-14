import { RadioGroup } from 'radix-ui'

import type { Props } from '~/lib'

import { Control } from './Control'
import { Token } from './Token'

type TextPickerProps = Props<
  typeof RadioGroup.Root,
  { options: string[]; name: string; value: number }
>

export function TextPicker({
  name,
  value,
  options,
  ...props
}: TextPickerProps) {
  return (
    <Control name={name} value={options[value]}>
      <RadioGroup.Root
        defaultValue={value.toString()}
        className='flex justify-center gap-2.5'
        {...props}>
        {options.map((text, i) => (
          <RadioGroup.Item key={text} value={i.toString()} asChild>
            <Token>{text}</Token>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </Control>
  )
}
