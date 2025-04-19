import { memo } from 'react'

import clsx from 'clsx'

import { AppDrawer } from 'app/components'

type AppWrapperProps = {
  isDark?: boolean
} & React.ComponentProps<'main'>

export const AppWrapper = memo(
  ({ isDark = false, className, children, ...props }: AppWrapperProps) => {
    return (
      <main
        className={clsx(
          'h-svh',
          isDark ? 'scheme-dark' : 'scheme-light',
          className,
        )}
        {...props}>
        <AppDrawer />
        {children}
      </main>
    )
  },
)

AppWrapper.displayName = 'AppWrapper'
