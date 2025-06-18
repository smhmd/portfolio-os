import { useEffect, useMemo, useRef } from 'react'

import { type PixiReactElementProps, useTick } from '@pixi/react'
import Matter from 'matter-js'
import type { AnimatedSprite } from 'pixi.js'

import { type CollisionPoint, FREQUENCY, useGame } from '../lib'

const { Vector } = Matter

type SparkProps = Partial<PixiReactElementProps<typeof AnimatedSprite>> &
  CollisionPoint

const variants = {
  small: {
    velocityScale: 0.5,
    anchor: 0.5,
    rotation: 0,
    animationSpeed: 2,
  },
  big: {
    velocityScale: 0.2,
    anchor: { x: 0.5, y: 0.6 },
    rotation: Math.PI,
    animationSpeed: 1,
  },
} as const

export function Spark({ type, id, delta, position, ...props }: SparkProps) {
  const { spritesheet } = useGame()
  const { velocityScale, anchor, rotation, animationSpeed } = variants[type]

  const sparkRef = useRef<AnimatedSprite>(null)

  const velocity = useMemo(() => {
    const perp = Vector.perp(delta, true)
    const decay = 0.4 + 0.5 * Math.random()
    return {
      x: -velocityScale * decay * perp.x + 5 - 10 * Math.random(),
      y: -velocityScale * decay * perp.y + 5 - 10 * Math.random(),
    }
  }, [])

  useEffect(() => {
    if (!sparkRef.current) return
    sparkRef.current.play()
  }, [])

  useTick(({ deltaMS }) => {
    if (!sparkRef.current) return
    const correction = deltaMS / FREQUENCY

    sparkRef.current.position.x += velocity.x * correction
    sparkRef.current.position.y += velocity.y * correction
  })

  if (!spritesheet) return null

  return (
    <pixiAnimatedSprite
      textures={spritesheet.animations['spark-' + type]}
      ref={sparkRef}
      x={position.x}
      y={position.y}
      rotation={rotation + Math.atan2(delta.y, delta.x)}
      label={`Spark (${type})`}
      anchor={anchor}
      blendMode='add'
      animationSpeed={animationSpeed}
      loop={false}
      {...props}
    />
  )
}
