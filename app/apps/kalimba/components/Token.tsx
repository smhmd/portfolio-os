import clsx from 'clsx'

import type { Props } from '~/lib'

type TokenProps = Props<'button'>

export function Token({
  className = 'bg-neutral-800',
  children,
  ...props
}: TokenProps) {
  return (
    <button
      className={clsx(
        'corner-shape-squircle group cursor-pointer rounded-full',
        'size-[clamp(2rem,16cqw,4.25rem)]',
        'relative outline-none',
        'bg-white',
      )}
      {...props}>
      <span className='absolute -inset-1' />
      <span
        className={clsx(
          'absolute -inset-px flex items-center justify-center whitespace-pre leading-7',
          'corner-shape-squircle block rounded-full capitalize',
          'group-active:scale-70 transition-transform',
          'group-data-[state=checked]:scale-80',
          className,
        )}>
        {children}
      </span>
    </button>
  )
}
