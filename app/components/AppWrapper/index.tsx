import { memo } from 'react'

import clsx from 'clsx'

type AppWrapperProps = {
  isDark?: boolean
} & React.ComponentProps<'main'>

export const AppWrapper = memo(
  ({ isDark = false, className, ...props }: AppWrapperProps) => {
    return (
      <main
        className={clsx(
          'h-dvh',
          'init:text-balance text-pretty',
          isDark ? 'scheme-dark' : 'scheme-light',
          className,
        )}
        {...props}
      />
    )
  },
)

AppWrapper.displayName = 'AppWrapper'
