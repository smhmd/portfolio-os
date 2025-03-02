import clsx from 'clsx'

import { Base } from './Base'

type ButtonProps = React.ComponentProps<'div'> & {
  variant?: 'DEFAULT' | 'large' | 'right' | 'left'
  black?: boolean
}

const variants = {
  base: {
    DEFAULT: 'col-span-2 row-span-2 **:aspect-square aspect-square',
    right: 'col-span-3 row-span-2 **:aspect-square',
    left: 'col-span-3 row-span-2 **:aspect-square',
    large: 'col-span-2 row-span-4',
  },
  bump: {
    DEFAULT: 'bg-bump inset-x-1.25 ',
    right: 'bg-bump right-1.25 ',
    left: 'bg-bump left-1.25 ',
    large: 'bg-bump-lg inset-x-1.25',
  },
  top: {
    DEFAULT: 'bg-radial-border inset-x-2.5 ',
    right: 'bg-radial-border right-2.5 ',
    left: 'bg-radial-border left-2.5 ',
    large: 'bg-radial-lg-border inset-x-2.5',
  },
} as const

export function Button({
  variant = 'DEFAULT',
  black,
  className,
  ...props
}: ButtonProps) {
  return (
    <Base
      className={clsx('shadow-base', variants.base[variant], className)}
      {...props}>
      <div
        data-name='button-bump'
        className={clsx(
          'blur-px inset-y-1.25 absolute rounded-full',
          variants.bump[variant],
        )}
      />
      <div
        className={clsx(
          'bg-radial-border rounded-full p-px',
          'shadow-button z-1 absolute inset-y-2.5',
          variants.top[variant],
        )}>
        <div className='bg-button size-full rounded-full p-0.5'>
          {black ? (
            <div className='bg-button-top size-full rounded-full' />
          ) : null}
        </div>
      </div>
    </Base>
  )
}
