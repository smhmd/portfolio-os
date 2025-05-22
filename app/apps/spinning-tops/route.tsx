import { Application, extend } from '@pixi/react'
import { AnimatedSprite, Container, Graphics, Sprite } from 'pixi.js'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { Game, ViewportProvider } from './components'
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
  return [favicon, { rel: 'stylesheet', href: styles }]
}

extend({ Sprite, Graphics, Container, AnimatedSprite })

export default function App() {
  return (
    <AppWrapper
      isDark
      className='flex cursor-none flex-col items-center justify-center bg-black bg-[url("/backdrop.png")] bg-cover bg-center bg-no-repeat'>
      <ViewportProvider>
        <PixiApplication />
      </ViewportProvider>
    </AppWrapper>
  )
}

let initialWidth = 0
let initialHeight = 0

if (typeof window !== 'undefined') {
  initialWidth = window.innerWidth
  initialHeight = window.innerHeight
}

function PixiApplication() {
  return (
    <Application
      antialias
      width={initialWidth}
      height={initialHeight}
      background={'#222'}>
      <Game />
    </Application>
  )
}
