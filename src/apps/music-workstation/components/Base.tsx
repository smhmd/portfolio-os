import clsx from 'clsx'

import type { Props } from 'src/lib/types'

type BaseProps = Props<'div', { indicator?: boolean }>

export function Base({
  className,
  children,
  ref,
  indicator = false,
  ...props
}: BaseProps) {
  return (
    <div
      className={clsx(
        'bg-base-border shadow-base relative rounded p-px',
        'init:text-3xl whitespace-pre-wrap font-thin',
        'init:col-span-2 init:row-span-2',

        className,
      )}
      {...props}
      ref={ref}>
      {indicator ? (
        <span className='absolute right-1.5 top-1.5 z-10 block size-2 rounded-full bg-black' />
      ) : null}
      <div className='bg-base rounded-ms relative grid size-full'>
        {children}
      </div>
    </div>
  )
}
