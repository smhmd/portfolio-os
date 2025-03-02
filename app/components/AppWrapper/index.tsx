import { memo } from 'react'

import clsx from 'clsx'

type AppWrapperProps = {
  /**
   * Used to switch to dark theme to be used with `light-dark()` -- notice how status bar icons turn black or white depending on app.
   */
  isDark?: boolean
  isFullscreen?: boolean
} & React.ComponentProps<'main'>

export const AppWrapper = memo(
  ({ isDark, isFullscreen, className, ...props }: AppWrapperProps) => {
    return (
      <main
        className={clsx(
          'h-screen',
          isDark && 'app-is-dark-themed',
          isFullscreen || 'pb-18 pt-10',
          className,
        )}
        {...props}
      />
    )
  },
)

AppWrapper.displayName = 'AppWrapper'
