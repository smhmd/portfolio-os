import clsx from 'clsx'

import { isDesktop } from 'src/lib/env'
import type { Props } from 'src/lib/types'

type TokenProps = Props<'button'>

export function Token({ className, children, ...props }: TokenProps) {
  return (
    <span
      className={clsx(
        'relative block cursor-pointer',
        'size-[clamp(2rem,16cqw,4.25rem)]',
        'rounded-full',
        isDesktop && 'corner-squircle',
        'bg-white text-center',
      )}
      {...props}>
      <span className='absolute -inset-1' />
      <span
        className={clsx(
          'absolute -inset-px flex items-center justify-center',
          'whitespace-pre capitalize leading-7',
          'rounded-full',
          isDesktop && 'corner-squircle',
          'bg-neutral-800',
          'transition-transform',
          'group-active:scale-70 group-data-checked:scale-80',
          className,
        )}>
        {children}
      </span>
    </span>
  )
}
