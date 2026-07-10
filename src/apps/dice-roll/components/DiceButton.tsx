import clsx from 'clsx'

import type { Props } from 'src/lib/types'

type ButtonProps = Props<'button', { label: string | number; color?: string }>

export function DiceButton({
  label,
  color = 'white',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'relative cursor-pointer',
        'flex items-center justify-center',
        'pointer-events-auto',
        'p-4 brightness-110',
        'text-shadow-lg text-center',
        'bg-no-repeat bg-blend-luminosity',
        'shadow-[inset_0_0_12px_#000]',
        'hocus:brightness-130 outline-none transition-[filter]',
        className,
      )}
      style={{
        backgroundImage: `url('/images/ice.avif')`,
        backgroundColor: `color-mix(in srgb, ${color} 100%, black)`,
        backgroundSize: 'cover',
        textShadow: '0 1px 3px #000',
      }}
      {...props}>
      <span className='relative z-10 leading-none'>{label}</span>
      <svg
        aria-hidden
        className='absolute size-full'
        viewBox='-1 -2.25 102 104'
        fill='none'
        preserveAspectRatio='none'>
        <rect
          width='100'
          height='100'
          filter='url(#light-from-above)'
          stroke='url(#bronze-radial)'
          strokeWidth='2'
          vectorEffect='non-scaling-stroke'
        />
      </svg>
      {ornaments.map((style, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox='0 0 14 14'
          className='absolute size-2'
          style={style}>
          <path
            filter='url(#light-from-above)'
            fill='url(#bronze-radial)'
            d='M7 0s.39 3.6 1.9 5.1C10.4 6.62 14 7 14 7s-3.6.39-5.1 1.9C7.38 10.4 7 14 7 14s-.39-3.6-1.9-5.1C3.6 7.38 0 7 0 7s3.6-.39 5.1-1.9C6.62 3.6 7 0 7 0'
          />
        </svg>
      ))}
    </button>
  )
}

const ornaments = [
  { top: 0.5, left: '50%', transform: 'translate(-50%,-50%)' },
  { bottom: 0.5, left: '50%', transform: 'translate(-50%,50%)' },
  { left: 0.5, top: '50%', transform: 'translate(-50%,-50%)' },
  { right: 0.5, top: '50%', transform: 'translate(50%,-50%)' },
]
