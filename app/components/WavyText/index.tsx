type Props = {
  value: string
} & React.ComponentProps<'span'>

export function WavyText({ value = '', ...props }: Props) {
  return (
    <span {...props}>
      {value.split('').map((letter, i) => (
        <span
          className='inline-block animate-bounce whitespace-pre'
          key={i}
          style={{
            animationDelay: `-${0.07 * i}s`,
          }}>
          {letter}
        </span>
      ))}
    </span>
  )
}
