import { useEffect, useRef } from 'react'

import Matter from 'matter-js'
import { Sprite } from 'pixi.js'

import { MAX_MOVEMENT, useGame } from '../lib'

const { Vector } = Matter

export function Crosshair() {
  const { centerX, centerY, scaleFactor, spritesheet, crosshair } = useGame()

  const dotRef = useRef<Sprite>(null)
  const armsRef = useRef<Sprite>(null)

  useEffect(() => {
    const controller = new AbortController()

    function handlePointerMove(e: MouseEvent) {
      if (!armsRef.current || !dotRef.current) return

      const x = (e.clientX - centerX) / scaleFactor
      const y = (e.clientY - centerY) / scaleFactor

      dotRef.current.position.x = x
      dotRef.current.position.y = y

      crosshair.x = x
      crosshair.y = y

      const isOutOfBounds = Vector.magnitude(crosshair) > MAX_MOVEMENT

      if (isOutOfBounds) {
        const distance = Vector.mult(Vector.normalise(crosshair), MAX_MOVEMENT)
        crosshair.x = distance.x
        crosshair.y = distance.y
      }

      armsRef.current.position.x = crosshair.x
      armsRef.current.position.y = crosshair.y
    }

    window.addEventListener('pointermove', handlePointerMove, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  })

  if (!spritesheet) return null

  return (
    <>
      <pixiSprite
        x={crosshair.x}
        y={crosshair.y}
        ref={armsRef}
        label='Crosshair Arms'
        texture={spritesheet.textures['crosshair-arms']}
        blendMode='add'
        tint={0x555555}
        anchor={0.5}
        zIndex={1}
      />
      <pixiSprite
        x={crosshair.x}
        y={crosshair.y}
        ref={dotRef}
        label='Crosshair Dot'
        texture={spritesheet.textures['crosshair-dot']}
        blendMode='screen'
        anchor={0.5}
        zIndex={1}
      />
    </>
  )
}
