import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import clsx from 'clsx'

import type { Props, SVGIcon } from 'src/lib/types'

import { Control } from './Control'
import { Token } from './Token'

type IconPickerProps = Props<
  typeof RadioGroup,
  {
    options: { label: string; Icon: SVGIcon }[]
    name: string
    value: number
  }
>

export function IconPicker({
  name,
  value,
  options,
  className,
  ...props
}: IconPickerProps) {
  const { Icon } = options[value]

  return (
    <Control
      name={name}
      value={<Icon aria-hidden className='size-9 fill-current' />}>
      <RadioGroup
        value={value.toString()}
        className={clsx(
          'grid grid-cols-5 place-items-center gap-2.5',
          className,
        )}
        {...props}>
        {options.map(({ label, Icon }, i) => (
          <Radio.Root
            className='group outline-none'
            key={label}
            value={i.toString()}
            aria-label={label}>
            <Token>
              <Icon aria-hidden className='size-9 fill-white' />
            </Token>
          </Radio.Root>
        ))}
      </RadioGroup>
    </Control>
  )
}
