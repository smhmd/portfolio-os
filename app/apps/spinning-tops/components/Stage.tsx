import { Application, extend } from '@pixi/react'
import { AnimatedSprite, Container, Graphics, Sprite } from 'pixi.js'

import { MatterProvider } from 'app/contexts'

import { Scene } from './Scene'

extend({ Sprite, Graphics, Container, AnimatedSprite })

type StageProps = React.ComponentProps<typeof Application>

export function Stage(props: StageProps) {
  return (
    <MatterProvider
      options={{
        gravity: { x: 0, y: 0 },
        enableSleeping: false,
        positionIterations: 10,
      }}>
      <Application
        antialias
        autoDensity
        className='animate-fade-in anim-duration-5000'
        {...props}>
        <Scene />
      </Application>
    </MatterProvider>
  )
}
