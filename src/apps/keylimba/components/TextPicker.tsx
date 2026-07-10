import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'

import type { Props } from 'src/lib/types'

import { Control } from './Control'
import { Token } from './Token'

type TextPickerProps = Props<
  typeof RadioGroup,
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
      <RadioGroup
        value={value.toString()}
        className='flex justify-center gap-2.5'
        {...props}>
        {options.map((text, i) => (
          <Radio.Root
            className='group outline-none'
            key={text}
            value={i.toString()}>
            <Token>{text}</Token>
          </Radio.Root>
        ))}
      </RadioGroup>
    </Control>
  )
}
