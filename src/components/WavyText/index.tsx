import { memo } from 'react'

type Props = {
  value: string
} & React.ComponentProps<'span'>

export const WavyText = memo(({ value = '', ...props }: Props) => (
  <span {...props}>
    {value.split('').map((letter, i) => (
      <span
        className='inline-block animate-bounce whitespace-pre'
        key={i}
        style={{ animationDelay: `-${0.07 * i}s` }}>
        {letter}
      </span>
    ))}
  </span>
))

WavyText.displayName = 'WavyText'
