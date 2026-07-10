import { useRef } from 'react'

import clsx from 'clsx'

import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import { GameProvider, Menu, Stage } from './components'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={18} />)
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Orbitron&display=swap',
    },
  ]
}

export default function App() {
  const ref = useRef<HTMLElement>(null)

  return (
    <Container
      id={metadata.id}
      ref={ref}
      className={clsx(
        'bg-radial to-220% from-[#171519] from-10% to-black bg-cover bg-center bg-no-repeat',
        'cursor-none! flex flex-col items-center justify-center overscroll-none',
        'font-orbitron text-cyan-200/70',
      )}>
      <GameProvider>
        <Stage resizeTo={ref} />
        <Menu />
      </GameProvider>
    </Container>
  )
}
