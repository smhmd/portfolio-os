import { useRef } from 'react'

import { Application, extend } from '@pixi/react'
import clsx from 'clsx'
import { AnimatedSprite, Container, Graphics, Sprite } from 'pixi.js'

extend({ Sprite, Graphics, Container, AnimatedSprite })

export function Screen(props: React.ComponentProps<'div'>) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={clsx(
        'col-span-8 row-span-4',
        'bg-screen-border font-silkscreen text-white',
        'rounded p-px',
      )}
      {...props}>
      <div
        ref={wrapperRef}
        className='bg-screen rounded-ms grid size-full place-items-center'>
        {wrapperRef.current ? <Scene wrapperRef={wrapperRef.current} /> : null}
      </div>
    </div>
  )
}

function Scene({ wrapperRef }: { wrapperRef: HTMLDivElement }) {
  const width = wrapperRef.offsetWidth
  const height = wrapperRef.offsetHeight
  const scaleFactor = Math.min(width, height) / 202
  const centerX = width / 2
  const centerY = height / 2

  return (
    <Application
      className='rounded-[3px]'
      antialias
      autoDensity
      resizeTo={wrapperRef}
      backgroundAlpha={0}>
      <pixiContainer x={centerX} y={centerY} scale={scaleFactor}>
        <Tombola />
      </pixiContainer>
    </Application>
  )
}

const BARRIER_RADIUS = 74

const outerStroke = { width: 2, color: 0xccd0c3 }

/**
 * Hexagon vertices
 */
const HEXAGON_POINTS = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2
  return [
    Math.cos(angle) * BARRIER_RADIUS,
    Math.sin(angle) * BARRIER_RADIUS,
  ] as const
})

export function Tombola() {
  return (
    <pixiContainer label='Tombola'>
      {HEXAGON_POINTS.map((points, i) => (
        <pixiGraphics
          label='HexLine'
          key={`line-${i}`}
          draw={(g) =>
            g
              .moveTo(...points)
              .lineTo(...HEXAGON_POINTS[(i + 1) % 6])
              .stroke(outerStroke)
          }
        />
      ))}

      <pixiGraphics
        label='SimpleCircle'
        draw={(g) => g.circle(0, 0, 4.5).fill(0xffffff)}
      />
    </pixiContainer>
  )
}
