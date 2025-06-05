import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'

import { type PixiReactElementProps, useTick } from '@pixi/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'
import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from 'pixi.js'

import { useAsync } from 'app/hooks'

import { useViewport } from '../lib'

const { Engine, Composite, Body, Bodies, Vector, Events } = Matter

const FREQUENCY = 1000 / 60
const MAX_ACCUMULATED_FREQUENCY = 100

const VISIBLE_WALLS = false

const engine = Engine.create({
  gravity: { x: 0, y: 0 },
  enableSleeping: false,
  positionIterations: 10,
})

function updateEngine(delta: number) {
  Engine.update(engine, delta, 1)
}

function addBody(object: TMatter.Body) {
  Composite.add(engine.world, object)
}

const EDGES_RADIUS = 512
const OUTER_CIRCLE_RADIUS = 498
const INNER_CIRCLE_RADIUS = 350
const SEGMENT_ANGLE = Math.PI / 3 // Hexagon points are at 60° intervals (π/3 radians)

// Arc segments (3 arcs, each spanning 60 degrees)
const ARC_SEGMENTS = Array.from({ length: 3 }, (_, i) => ({
  start: (2 * i + 1) * SEGMENT_ANGLE,
  end: (2 * i + 2) * SEGMENT_ANGLE,
}))

// Hexagon corners coordinates
const HEX_CORNERS = Array.from({ length: 6 }, (_, i) => ({
  x: EDGES_RADIUS * Math.cos(i * SEGMENT_ANGLE),
  y: EDGES_RADIUS * Math.sin(i * SEGMENT_ANGLE),
}))

// Line segments between every other pair of corners
const LINE_SEGMENTS = Array.from({ length: 3 }, (_, i) => ({
  start: HEX_CORNERS[2 * i],
  end: HEX_CORNERS[2 * i + 1],
}))

const arenaStroke = { width: 2, color: 0x314344 }

const BOX_PER_ROW = 10

const SIZE = (OUTER_CIRCLE_RADIUS * Math.PI) / (BOX_PER_ROW * 3)
const RADIUS = OUTER_CIRCLE_RADIUS + SIZE / 2
const TOTAL_BOX_COUNT = BOX_PER_ROW * 3
const OFFSET = -((BOX_PER_ROW - 1) / 2)

const walls = Array.from({ length: TOTAL_BOX_COUNT }, (_, i) => {
  const numerator = OFFSET + i + Math.floor(i / BOX_PER_ROW) * BOX_PER_ROW
  const angle = Math.PI * (numerator / TOTAL_BOX_COUNT)
  const x = -RADIUS * Math.sin(angle)
  const y = RADIUS * Math.cos(angle)
  return {
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3)),
    angle,
  }
})

walls.forEach(({ x, y, angle }) => {
  const box = Bodies.rectangle(x, y, SIZE, SIZE, {
    restitution: 0,
    angle,
    isStatic: true,
  })
  addBody(box)
})

const MAX_MOVEMENT = 400
const PLAYER_RADIUS = 40

const crosshair = Vector.create(0, 0)

const player = Bodies.circle(0, 0, PLAYER_RADIUS, {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
})

const computer = Bodies.circle(0, -150, PLAYER_RADIUS, {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
})

addBody(player)
addBody(computer)

const MOVEMENT_FORCE_SCALE = 0.0014
const BOUNDARY_BOUNCE_FORCE_SCALE = 0.09
const PLAYER_BOUNCE_FORCE_SCALE = 0.5
const ADDED_FORCE_SCALE = 0.005

function applyMovementForce(body: TMatter.Body, target: TMatter.Vector) {
  const direction = Vector.sub(body.position, target)
  const normal = Vector.normalise(direction)
  const speed = Math.min(Vector.magnitudeSquared(direction), 10)
  const force = Vector.mult(normal, -MOVEMENT_FORCE_SCALE * speed)

  Body.applyForce(body, body.position, force)
}

function applyAddedForce({ bodyA, bodyB, collision }: TMatter.Pair) {
  collision.supports.forEach((point) => {
    if (!point) return

    const velocity = Vector.sub(bodyB.velocity, bodyA.velocity)
    const speed = Vector.magnitude(velocity)
    const force = Vector.mult(collision.normal, ADDED_FORCE_SCALE * speed)

    Body.applyForce(bodyA, point, force)
    Body.applyForce(bodyB, point, Vector.neg(force))
  })
}

type CollisionPoint = {
  id: string
  type: 'small' | 'big'
  position: TMatter.Vector
  delta: TMatter.Vector
}

export function Game() {
  const { centerX, centerY, scaleFactor } = useViewport()

  const dotRef = useRef<Sprite>(null)
  const armsRef = useRef<Sprite>(null)

  const isRimActive = useRef(false)
  const loser = useRef<'player' | 'computer'>(null)

  const deactivateRim = useCallback(() => {
    isRimActive.current = false
  }, [])

  const { data: spritesheet } = useAsync(async () =>
    Assets.load<Spritesheet>('/sprites/spinning-tops.json'),
  )

  const addedForceQueue = useRef<TMatter.Pair[]>([])

  type State = CollisionPoint[]
  type Actions =
    | {
        type: 'add'
        payload: { position: TMatter.Vector; delta: TMatter.Vector }
      }
    | { type: 'remove'; payload: string }

  const [sparks, send] = useReducer((state: State, action: Actions) => {
    if (action.type === 'add') {
      return [
        ...state,
        ...Array.from({ length: 4 }, () => ({
          id: crypto.randomUUID(),
          type: 'small' as const,
          ...action.payload,
        })),
        ...Array.from({ length: 2 }, () => ({
          id: crypto.randomUUID(),
          type: 'big' as const,
          ...action.payload,
        })),
      ]
    }

    if (action.type === 'remove') {
      return state.filter(({ id }) => id !== action.payload)
    }

    return state
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    function handleMouseMove(e: MouseEvent) {
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

    function handleCollisionStart(
      event: TMatter.IEventCollision<TMatter.Engine>,
    ) {
      for (const pair of event.pairs) {
        const { bodyA, bodyB, collision } = pair

        if (bodyA.isStatic || bodyB.isStatic) {
          const playerBody = bodyA.isStatic ? bodyB : bodyA

          // REFACTOR
          const delta = Vector.mult(
            playerBody.position,
            BOUNDARY_BOUNCE_FORCE_SCALE,
          )

          collision.supports.map((position) => {
            if (position) {
              send({
                type: 'add',
                payload: { delta, position },
              })
            }
          })
        } else {
          isRimActive.current = true

          const delta = Vector.mult(
            Vector.sub(bodyB.position, bodyA.position),
            PLAYER_BOUNCE_FORCE_SCALE,
          )

          collision.supports.map((position) => {
            if (position) {
              send({
                type: 'add',
                payload: { delta, position },
              })

              send({
                type: 'add',
                payload: { delta: Vector.neg(delta), position },
              })
            }
          })

          addedForceQueue.current.push(pair)
        }
      }
    }

    function handleBeforeUpdate() {
      applyMovementForce(player, crosshair)
      applyMovementForce(computer, player.position) // simplified AI

      while (addedForceQueue.current.length > 0) {
        const pair = addedForceQueue.current.shift()!
        applyAddedForce(pair)
      }

      if (!loser.current) {
        const playerMagnitude = Vector.magnitude(player.position)
        const computerMagnitude = Vector.magnitude(computer.position)

        if (playerMagnitude >= OUTER_CIRCLE_RADIUS) {
          loser.current = 'player'
        }

        if (computerMagnitude >= OUTER_CIRCLE_RADIUS) {
          console.log('hi')
          loser.current = 'computer'
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, {
      signal: controller.signal,
    })
    Events.on(engine, 'collisionStart', handleCollisionStart)
    Events.on(engine, 'beforeUpdate', handleBeforeUpdate)

    return () => {
      controller.abort()
      Events.off(engine, 'beforeUpdate')
      Events.off(engine, 'collisionStart')
    }
  }, [])

  const accumulator = useRef(0)

  useTick(({ deltaMS }) => {
    accumulator.current += Math.min(deltaMS, MAX_ACCUMULATED_FREQUENCY)

    while (accumulator.current >= FREQUENCY) {
      updateEngine(FREQUENCY)

      accumulator.current -= FREQUENCY
    }
  })

  return (
    <pixiContainer x={centerX} y={centerY} scale={scaleFactor}>
      <pixiContainer label='Stadium'>
        {ARC_SEGMENTS.map(({ start, end }, i) => (
          <pixiGraphics
            label='Arc'
            key={`arc-${i}`}
            draw={(g) =>
              g.arc(0, 0, EDGES_RADIUS, start, end).stroke(arenaStroke)
            }
          />
        ))}

        {LINE_SEGMENTS.map(({ start, end }, i) => (
          <pixiGraphics
            label='Line'
            key={`line-${i}`}
            x={start.x}
            y={start.y}
            draw={(g) =>
              g.lineTo(end.x - start.x, end.y - start.y).stroke(arenaStroke)
            }
          />
        ))}

        <pixiGraphics
          label='Circle (outer)'
          draw={(g) => {
            g.fill(0x0e0d0f)
              .circle(0, 0, OUTER_CIRCLE_RADIUS)
              .stroke(arenaStroke)
          }}
        />
        <pixiGraphics
          label='Circle (inner)'
          draw={(g) => {
            g.circle(0, 0, INNER_CIRCLE_RADIUS).stroke({
              width: 1,
              color: 0x1d2627,
            })
          }}
        />
      </pixiContainer>

      <pixiContainer visible={VISIBLE_WALLS}>
        {walls.map((box, i) => (
          <pixiGraphics
            key={i}
            alpha={0.2}
            x={box.x}
            y={box.y}
            rotation={box.angle}
            draw={(g) => {
              g.clear()
              g.rect(-SIZE / 2, -SIZE / 2, SIZE, 12)
              g.fill(0xffff00)
            }}
          />
        ))}
      </pixiContainer>

      {spritesheet && (
        <>
          {sparks.map((spark) => (
            <Spark
              onComplete={() => {
                send({ type: 'remove', payload: spark.id })
              }}
              key={spark.id}
              textures={spritesheet.animations['spark-' + spark.type]}
              {...spark}
            />
          ))}
          <pixiSprite
            ref={armsRef}
            label='Crosshair Arms'
            texture={spritesheet.textures['crosshair-arms']}
            blendMode='add'
            tint={0x555555}
            anchor={0.5}
            zIndex={1}
          />
          <pixiSprite
            ref={dotRef}
            label='Crosshair Dot'
            texture={spritesheet.textures['crosshair-dot']}
            blendMode='screen'
            anchor={0.5}
            zIndex={1}
          />

          <Top
            id='player'
            position={player.position}
            spritesheet={spritesheet}
            isRimActive={isRimActive.current}
            loser={loser.current}
            deactivateRim={deactivateRim}
            tint={0xffd87b}
          />

          <Top
            id='computer'
            position={computer.position}
            spritesheet={spritesheet}
            isRimActive={isRimActive.current}
            loser={loser.current}
            deactivateRim={deactivateRim}
            tint={0xffffff}
          />
        </>
      )}
    </pixiContainer>
  )
}

type TopProps = PixiReactElementProps<typeof Container> & {
  id: string
  position: TMatter.Vector
  spritesheet: Spritesheet
  isRimActive: boolean
  loser: null | 'player' | 'computer'
  deactivateRim: () => void
}

const Top = memo(
  ({
    id,
    position,
    spritesheet,
    isRimActive,
    loser,
    deactivateRim,
    tint,
    ...props
  }: TopProps) => {
    const playerRef = useRef<Container>(null)
    const topRef = useRef<Container>(null)
    const rimRef = useRef<Container>(null)
    const exitRef = useRef<Container>(null)

    useTick(({ deltaTime, deltaMS }) => {
      if (
        !playerRef.current ||
        !rimRef.current ||
        !exitRef.current ||
        !topRef.current
      )
        return

      if (loser === id) {
        exitRef.current.visible = true

        topRef.current.visible = false
        rimRef.current.visible = false
        return
      }

      if (isRimActive) {
        rimRef.current.visible = true
        rimRef.current.alpha = 1
        deactivateRim()
      }

      if (rimRef.current.visible) {
        const RIM_DURATION = 400 // ms
        const FADE_RATE = deltaMS / RIM_DURATION

        rimRef.current.alpha -= FADE_RATE

        if (rimRef.current.alpha < 0) {
          rimRef.current.visible = false
          rimRef.current.alpha = 1
        }
      }

      playerRef.current.position = position
      playerRef.current.rotation += 0.25 * deltaTime
    })

    return (
      <pixiContainer label={id} ref={playerRef} position={position} {...props}>
        <pixiContainer visible={true} ref={topRef}>
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
            <pixiContainer
              visible={false}
          ref={exitRef}
              label='Exit'
              tint={0xffd87b}
              anchor={0.5}>
              <pixiAnimatedSprite
                label='Exit'
                textures={spritesheet.animations['exit']}
                anchor={0.5}
                blendMode='add'
                animationSpeed={0.5}
                loop={true}
              />
              <pixiSprite
                anchor={0.5}
                texture={spritesheet.textures['bitchip-muted']}
              />
            </pixiContainer>
          </pixiContainer>
    )
  },
)

Top.displayName = 'Top'

type SparkProps = PixiReactElementProps<typeof AnimatedSprite> & CollisionPoint

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

function Spark({ type, id, delta, position, ...props }: SparkProps) {
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

  return (
    <pixiAnimatedSprite
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
