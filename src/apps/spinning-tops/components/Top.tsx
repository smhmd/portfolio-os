import { memo, useEffect, useRef } from 'react'

import { type PixiReactElementProps, useTick } from '@pixi/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'
import type { AnimatedSprite, Container, Sprite } from 'pixi.js'

import { actor, fadeObjectOut, type PlayerID, useGame, useMatter } from '../lib'

const { Vector } = Matter

type TopProps = PixiReactElementProps<typeof Container> & {
  id: PlayerID
  body: TMatter.Body
  eliminated: React.RefObject<PlayerID | null>
}

/**
 * Purely presentational: renders one top, its rim flash, and its exit
 * VFX. WHO gets eliminated is decided by the battle layer (<Battle>
 * locally; the host's verdict via <NetBattle> online) and communicated
 * through the shared `eliminated` ref — this component only reacts.
 */
export const Top = memo(
  ({ id, body, tint = 0xffffff, eliminated, ...props }: TopProps) => {
    const { spritesheet } = useGame()
    const { addBody, removeBody, addEngineEvent } = useMatter()

    const playerRef = useRef<Container>(null)

    const topRef = useRef<Container>(null)
    const rimRef = useRef<Container>(null)
    const exitRef = useRef<AnimatedSprite>(null)
    const bitchipRef = useRef<Sprite>(null)

    const lastVelocityRef = useRef(Vector.create(0, 0))

    function handleExit() {
      if (!rimRef.current) return
      if (!exitRef.current) return
      if (!bitchipRef.current) return
      if (!topRef.current) return

      lastVelocityRef.current = Vector.clone(body.velocity)

      exitRef.current.visible = true
      bitchipRef.current.visible = true

      topRef.current.visible = false
      rimRef.current.visible = false

      exitRef.current.play()

      removeBody(body)
    }

    function handleExitComplete() {
      if (!exitRef.current) return
      if (!bitchipRef.current) return

      exitRef.current.visible = false
      bitchipRef.current.visible = false

      if (eliminated.current === id) {
        actor.send({ type: 'player.lose', payload: id })
      }
    }

    // Body + collision handler share the same mount/unmount boundary,
    // and the unsubscribe removes only this component's handler.
    useEffect(() => {
      addBody(body)

      const removeCollision = addEngineEvent('collisionStart', (event) => {
        if (!rimRef.current) return

        for (const pair of event.pairs) {
          const { bodyA, bodyB } = pair

          if (!bodyA.isStatic && !bodyB.isStatic) {
            rimRef.current.visible = true
            rimRef.current.alpha = 1
          }
        }
      })

      return () => {
        removeCollision()
        removeBody(body) // safe if already removed by handleExit
      }
    }, [])

    useTick(({ deltaTime, deltaMS }) => {
      if (!playerRef.current) return
      if (!rimRef.current) return
      if (!bitchipRef.current) return

      // The elimination verdict arrived — hand this top over to its
      // exit animation, exactly once (handleExit hides topRef).
      if (eliminated.current === id && topRef.current?.visible) handleExit()

      fadeObjectOut(rimRef.current, deltaMS / 400)
      fadeObjectOut(bitchipRef.current, deltaMS / 400)

      if (exitRef.current?.visible) {
        const delta = deltaMS / 100
        playerRef.current.position.x += 3 * lastVelocityRef.current.x * delta
        playerRef.current.position.y += 3 * lastVelocityRef.current.y * delta
      } else if (playerRef.current.visible) {
        playerRef.current.position = body.position
        playerRef.current.rotation += 0.2 * deltaTime
      }
    })

    if (!spritesheet) return null

    return (
      <pixiContainer
        label={id}
        ref={playerRef}
        position={body.position}
        {...props}>
        <pixiContainer ref={topRef}>
          <pixiSprite
            label='Top'
            anchor={0.5}
            texture={spritesheet.textures['top']}
            tint={tint}
          />
          <pixiSprite
            label='Bit Chip'
            anchor={0.5}
            position={{ x: 0, y: 0 }}
            texture={spritesheet.textures['bitchip']}
          />
        </pixiContainer>
        <pixiContainer visible={false} ref={rimRef} label='Rim' blendMode='add'>
          <pixiSprite
            label='Rim'
            anchor={0.5}
            texture={spritesheet.textures['rim']}
          />
          <pixiSprite
            label='Burst'
            anchor={0.5}
            texture={spritesheet.textures['rim-burst']}
          />
        </pixiContainer>
        <pixiContainer label='Exit' tint={0xffd87b} anchor={0.5}>
          <pixiAnimatedSprite
            visible={false}
            onComplete={handleExitComplete}
            ref={exitRef}
            label='Exit'
            textures={spritesheet.animations['exit']}
            anchor={0.5}
            blendMode='add'
            animationSpeed={0.3}
            loop={false}
          />
          <pixiSprite
            ref={bitchipRef}
            visible={false}
            anchor={0.5}
            texture={spritesheet.textures['bitchip-muted']}
          />
        </pixiContainer>
      </pixiContainer>
    )
  },
)

Top.displayName = 'Top'
