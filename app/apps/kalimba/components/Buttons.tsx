import clsx from 'clsx'

import type { Props } from 'app/lib'

const sharedClassName = 'transition-transform group-active:translate-y-[1.5px]'

type BaseButtonProps = Props<'button', ProgressProps>

export function BaseButton({
  children,
  className,
  animation,
  duration,
  ...props
}: BaseButtonProps) {
  return (
    <button
      className={clsx('group relative cursor-pointer outline-none', className)}
      {...props}>
      <Halo className='group-active:translate-y-1' />
      <span className='block size-12 *:size-full xl:size-24'>{children}</span>
      {animation && (
        <ProgressIcon
          className='size-22 xl:size-42 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
          animation={animation}
          duration={duration}
        />
      )}
    </button>
  )
}

type BaseLinkProps = Props<'a'>

export function BaseLink({ children, className, ...props }: BaseLinkProps) {
  return (
    <a
      className={clsx('group relative cursor-pointer outline-none', className)}
      {...props}>
      <Halo className='group-active:translate-y-1' />
      <span className='block size-12 *:size-full xl:size-24'>{children}</span>
    </a>
  )
}

export function MenuButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props}>
      <svg strokeLinecap='round' strokeWidth='4' viewBox='0 0 24 24'>
        <path
          stroke='#000'
          strokeOpacity='.3'
          d='M3 5.5h18m-18 8h18m-18 8h18'
        />
        <path
          className={sharedClassName}
          stroke='#fff'
          d='M3 4h18M3 12h18M3 20h18'
        />
      </svg>
    </BaseButton>
  )
}

export function RecordButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props}>
      <svg viewBox='0 0 24 24'>
        <circle cy='13.25' cx='12' r='10.75' fill='#000' fillOpacity='.3' />
        <circle
          cy='11.75'
          cx='12'
          r='10.75'
          fill='#fff'
          className={sharedClassName}
        />
      </svg>
    </BaseButton>
  )
}

export function PlayButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props} animation='spin'>
      <svg viewBox='0 0 24 24'>
        <path
          fill='#000'
          fillOpacity='.3'
          d='M4 4.6a2 2 0 0 1 1-1.8 2 2 0 0 1 2 0l15 8.7a2 2 0 0 1 1 1.8 2 2 0 0 1-1 1.7l-15 8.7a2 2 0 0 1-2.8-.8l-.2-1z'
        />
        <path
          className={sharedClassName}
          fill='#fff'
          d='M4 3.1a2 2 0 0 1 1-1.8 2 2 0 0 1 2 0l15 8.7a2 2 0 0 1 1 1.8 2 2 0 0 1-1 1.7l-15 8.7a2 2 0 0 1-2.8-.8l-.2-1z'
        />
      </svg>
    </BaseButton>
  )
}

export function ResetButton(props: BaseButtonProps) {
  return (
    <BaseButton {...props} animation='fill'>
      <svg viewBox='0 0 24 24'>
        <rect
          width='18.5'
          height='18.5'
          x='2.75'
          y='3.5'
          fill='#000'
          fillOpacity='.3'
          rx='2'
        />
        <rect
          className={sharedClassName}
          width='18.5'
          height='18.5'
          x='2.75'
          y='2'
          fill='#fff'
          rx='2'
        />
      </svg>
    </BaseButton>
  )
}

export function DownloadLink(props: BaseLinkProps) {
  return (
    <BaseLink {...props}>
      <svg viewBox='0 0 24 24'>
        <path
          fill='#000'
          fillOpacity='.3'
          d='M17.6 10.2h-2V4.6q0-1-1.2-1.1H9.6q-1.1.1-1.2 1.1v5.6h-2c-1 0-1.6 1.2-.8 2l5.5 5q.9.7 1.8 0l5.5-5c.8-.8.3-2-.8-2M3.5 21.4q0 1 1.2 1.1h14.6q1.1-.1 1.2-1.1t-1.2-1.1H4.7q-1.1.1-1.2 1'
        />
        <path
          className={sharedClassName}
          fill='#fff'
          d='M17.6 8.7h-2V3.1q0-1-1.2-1.1H9.6q-1.1.1-1.2 1.1v5.6h-2c-1 0-1.6 1.2-.8 2l5.5 5q.9.7 1.8 0l5.5-5c.8-.8.3-2-.8-2M3.5 20q0 1 1.2 1.1h14.6q1.1-.1 1.2-1.1t-1.2-1.1H4.7q-1.1.1-1.2 1'
        />
      </svg>
    </BaseLink>
  )
}

type ProgressProps = {
  animation?: 'spin' | 'fill'
  duration?: string
}

type ProgressIconType = Props<'svg', ProgressProps>

const variants = {
  spin: 'anim-duration-1600 animate-spin [stroke-dashoffset:66]',
  fill: 'animate-fill-stroke',
} as const

export function ProgressIcon({
  animation = 'spin',
  duration: animationDuration,
  ...props
}: ProgressIconType) {
  return (
    <svg viewBox='0 0 40 40' {...props}>
      <path
        style={{ transformOrigin: '20px 21px', animationDuration }}
        className={clsx(variants[animation])}
        d='M20 5 A16 16 0 1 1 20 37 A16 16 0 1 1 20 5'
        fill='none'
        stroke='#000'
        strokeDasharray={100}
        strokeLinecap='round'
        strokeOpacity='.3'
        strokeWidth='2.5'
      />
      <path
        style={{ transformOrigin: '20px 19.5px', animationDuration }}
        className={clsx(variants[animation], sharedClassName)}
        d='M20 3.5 A16 16 0 1 1 20 35.5 A16 16 0 1 1 20 3.5'
        fill='none'
        stroke='#fff'
        strokeDasharray={100}
        strokeLinecap='round'
        strokeWidth='2.5'
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
