import clsx from 'clsx'

import type { Props } from 'app/lib'

type IconProps = Props<'svg'>

export function MenuIcon({ className, ...props }: IconProps) {
  return (
    <svg
      className={clsx('group', className)}
      strokeLinecap='round'
      strokeWidth='4'
      viewBox='0 0 24 24'
      {...props}>
      <path stroke='#000' strokeOpacity='.30' d='M3 5.5h18m-18 8h18m-18 8h18' />
      <path
        className='transition-transform group-active:translate-y-[1.5px]'
        stroke='#fff'
        d='M3 4h18M3 12h18M3 20h18'
      />
    </svg>
  )
}

export function RecordIcon({ className, ...props }: IconProps) {
  return (
    <svg className={clsx('group', className)} viewBox='0 0 24 24' {...props}>
      <circle cy='13.25' cx='12' r='10.75' fill='#000' fillOpacity='.30' />
      <circle
        cy='11.75'
        cx='12'
        r='10.75'
        fill='#fff'
        className='transition-transform group-active:translate-y-[1.5px]'
      />
    </svg>
  )
}

type HaloProps = Props<'span'>

export function Halo({ className, ...props }: HaloProps) {
  return (
    <span
      className={clsx(
        'absolute -inset-3 aspect-square rounded-full bg-white/20',
        'scale-0 opacity-0 transition-all duration-200',
        'group-focus-visible:scale-100 group-focus-visible:opacity-100',
        'group-hover:scale-100 group-hover:opacity-100',
        'group-active:scale-95',
        className,
      )}
      {...props}
    />
  )
}
