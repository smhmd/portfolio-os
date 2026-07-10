import type { AnimatedSprite } from 'pixi.js'

import { sparkVariants, useGame } from '../lib'

type SparkProps = {
  type: 'small' | 'big'
  onComplete: () => void
  ref: React.Ref<AnimatedSprite>
}

export function Spark({ type, onComplete, ref }: SparkProps) {
  const { spritesheet } = useGame()

  if (!spritesheet) return null

  const { anchor, animationSpeed } = sparkVariants[type]

  return (
    <pixiAnimatedSprite
      ref={ref}
      textures={spritesheet.animations[`spark-${type}`]}
      visible={false}
      anchor={anchor}
      blendMode='add'
      animationSpeed={animationSpeed}
      loop={false}
      onComplete={onComplete}
    />
  )
}
