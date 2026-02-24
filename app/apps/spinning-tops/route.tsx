import { useRef } from 'react'

import clsx from 'clsx'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { GameProvider, Menu, Stage } from './components'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={18} />)
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Orbitron&display=swap',
    },
    { rel: 'stylesheet', href: styles },
  ]
}

export default function App() {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <AppWrapper
      ref={ref}
      isDark
      className={clsx(
        'bg-radial to-220% from-[#171519] from-10% to-black bg-cover bg-center bg-no-repeat',
        'cursor-none! flex flex-col items-center justify-center overscroll-none',
        'font-orbitron text-cyan-200/70',
      )}>
      <GameProvider>
        <Stage resizeTo={ref} />
        <Menu />
      </GameProvider>
    </AppWrapper>
  )
}
