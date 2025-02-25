import clsx from 'clsx'

import { Base } from './Base'

type ButtonProps = React.ComponentProps<'div'> & {
  variant?: Partial<{
    size: 'DEFAULT' | 'lg'
    color: 'DEFAULT' | 'black'
    pos: 'DEFAULT' | 'right' | 'left'
  }>
}

const defaultVariant = {
  size: 'DEFAULT',
  color: 'DEFAULT',
  pos: 'DEFAULT',
} as const

const variants = {
  col: {
    DEFAULT: 'col-span-2',
    right: 'col-span-3',
    left: 'col-span-3',
  },
  row: {
    DEFAULT: 'row-span-2',
    lg: 'row-span-4',
  },
  bump: {
    bg: {
      DEFAULT: 'bg-bump',
      lg: 'bg-bump-lg',
    },
    pos: {
      DEFAULT: 'inset-x-1.25',
      right: 'right-1.25 aspect-square',
      left: 'left-1.25 aspect-square',
    },
  },
  body: {
    bg: {
      DEFAULT: 'bg-radial-border',
      lg: 'bg-radial-lg-border',
    },
    pos: {
      DEFAULT: 'inset-x-2.5',
      right: 'right-2.5 aspect-square',
      left: 'left-2.5 aspect-square',
    },
  },
} as const

export function Button({ variant, className, ...props }: ButtonProps) {
  const { color, size, pos } = { ...defaultVariant, ...variant }

  return (
    <Base
      className={clsx(
        'shadow-base',
        variants.col[pos],
        variants.row[size],
        className,
      )}
      {...props}>
      <div
        data-name='button-bump'
        className={clsx(
          'blur-px inset-y-1.25 absolute rounded-full',
          variants.bump.bg[size],
          variants.bump.pos[pos],
        )}
      />
      <div
        className={clsx(
          'bg-radial-border rounded-full p-px',
          'shadow-button z-1 absolute inset-y-2.5',
          variants.body.bg[size],
          variants.body.pos[pos],
        )}>
        <div className='bg-button size-full rounded-full p-0.5'>
          {color === 'black' ? (
            <div className='bg-button-top size-full rounded-full' />
          ) : null}
        </div>
      </div>
    </Base>
  )
}
