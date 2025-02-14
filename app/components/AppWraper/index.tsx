import clsx from 'clsx'

type AppWraperProps = {
  /**
   * Used to switch to dark theme to be used with `light-dark()` -- notice how status bar icons turn black or white depending on app.
   */
  isDark?: boolean
  fullscreen?: boolean
} & React.ComponentProps<'main'>

export function AppWraper({
  isDark = false,
  fullscreen,
  className,
  ...props
}: AppWraperProps) {
  return (
    <main
      className={clsx(
        'h-screen',
        isDark && 'app-is-dark-themed',
        fullscreen || 'pb-18 pt-10',
        className,
      )}
      {...props}
    />
  )
}
