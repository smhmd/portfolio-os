import clsx from 'clsx'

import { AppGrid } from 'src/components'

export function meta() {
  return [
    { title: 'Home' },
    { name: 'description', content: 'OS-themed portfolio inside the browser' },
  ]
}

export default function AppDrawer() {
  return (
    <main
      className={clsx(
        'h-screen',
        'wp-[wallpaper.jpg] bg-cover bg-center bg-no-repeat',
        'fixed inset-0 flex flex-col items-center',
        'sm:pt-22.5 p-2 pt-8 sm:p-8',
      )}>
      <AppGrid />
    </main>
  )
}
