import { forwardRef } from 'react'

import clsx from 'clsx'

type Props = React.ComponentProps<'div'>

export const Base = forwardRef<HTMLDivElement, Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={clsx('bg-base-border rounded p-px', className)}
        {...props}
        ref={ref}>
        <div className='bg-base rounded-ms relative grid size-full'>
          {children}
        </div>
      </div>
    )
  },
)

Base.displayName = 'Base'
