import { Application, extend } from '@pixi/react'
import clsx from 'clsx'
import { AnimatedSprite, Container, Graphics, Sprite } from 'pixi.js'

import { AppWrapper } from 'app/components'
import { MatterProvider } from 'app/contexts'
import { isClient } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { GameProvider, Menu, Scene } from './components'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon padding={13} />)
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Orbitron&display=swap',
    },
    { rel: 'stylesheet', href: styles },
  ]
}

extend({ Sprite, Graphics, Container, AnimatedSprite })

const initialWidth = isClient ? window.innerWidth : 0
const initialHeight = isClient ? window.innerHeight : 0

export default function App() {
  return (
    <AppWrapper
      isDark
      className={clsx(
        'bg-[url("/backdrop.png")] bg-cover bg-center bg-no-repeat',
        'cursor-none! flex flex-col items-center justify-center overscroll-none',
        'font-orbitron text-cyan-200/70',
      )}>
      <GameProvider>
        <MatterProvider
          options={{
            gravity: { x: 0, y: 0 },
            enableSleeping: false,
            positionIterations: 10,
          }}>
          <Application antialias width={initialWidth} height={initialHeight}>
            <Scene />
          </Application>
        </MatterProvider>
        <Menu />
      </GameProvider>
    </AppWrapper>
  )
}
