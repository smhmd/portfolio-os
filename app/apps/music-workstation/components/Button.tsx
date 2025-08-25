import clsx from 'clsx'

import { Base } from './Base'

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'middle' | 'large' | 'right' | 'left'
  black?: boolean
}

const variants = {
  base: {
    middle: 'col-span-2 row-span-2 aspect-square',
    right: 'col-span-3 row-span-2',
    left: 'col-span-3 row-span-2',
    large: 'col-span-2 row-span-4',
  },
  bump: {
    middle: 'bg-bump inset-x-1.25 aspect-square',
    right: 'bg-bump right-1.25 aspect-square',
    left: 'bg-bump left-1.25 aspect-square',
    large: 'bg-bump-lg inset-x-1.25',
  },
  top: {
    middle: 'bg-radial-border inset-x-2.5 aspect-square',
    right: 'bg-radial-border right-2.5 aspect-square',
    left: 'bg-radial-border left-2.5 aspect-square',
    large: 'bg-radial-lg-border inset-x-2.5',
  },
} as const

/**
 * It's a button
 * @param {ButtonProps} props props
 * @returns {object} JSX
 */
export function Button({
  variant = 'middle',
  black,
  className,
  ...props
}: ButtonProps) {
  return (
    <Base
      className={clsx(
        'shadow-base text-xs',
        variants.base[variant],
        className,
      )}>
      <button className='z-2 cursor-pointer' {...props} />
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
