import { useEffect, useRef, useState } from 'react'

import { type PixiReactElementProps, useTick } from '@pixi/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'
import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from 'pixi.js'

import { useAsync } from 'app/hooks'

import { useViewport } from '../lib'

const { Engine, Composite, Body, Bodies, Vector, Events } = Matter

const engine = Engine.create({
  gravity: { x: 0, y: 0 },
  enableSleeping: false,
  positionIterations: 10,
})

function updateEngine(delta: number) {
  Engine.update(engine, delta, 1)
}

function addBody(object: TMatter.Body | TMatter.Body[]) {
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

const BOX_PER_ROW = 6

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

const MAX_TARGET_DISTANCE = 400
const MAX_TARGET_DISTANCE_SQUARED = MAX_TARGET_DISTANCE ** 2

const PLAYER_RADIUS = 40

const crosshairPosition = Vector.create(0, 0)

const playerA = Bodies.circle(0, 0, PLAYER_RADIUS, {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
})

addBody(playerA)

const playerB = Bodies.circle(150, 150, PLAYER_RADIUS, {
  restitution: 1,
  mass: 5,
  friction: 0,
  frictionAir: 0.05,
})

addBody(playerB)

function applyMovementForce(body: TMatter.Body, target: TMatter.Vector) {
  const direction = Vector.sub(body.position, target)
  const distanceSquared = Vector.magnitudeSquared(direction)

  Body.applyForce(
    body,
    body.position,
    Vector.mult(
      Vector.normalise(direction),
      -0.0014 * Math.min(distanceSquared, 10),
    ),
  )
}

type CollisionPoint = { x: number; y: number }

export function Game() {
  const [collisionPoints, setCollisionPoints] = useState<CollisionPoint[]>([])

  const { centerX, centerY, scaleFactor } = useViewport()

  const dotRef = useRef<Sprite>(null)
  const armsRef = useRef<Sprite>(null)
  const playerARef = useRef<Container>(null)
  const playerBRef = useRef<Container>(null)

  const { data: spritesheet } = useAsync(async () =>
    Assets.load<Spritesheet>('/sprites/spinning-tops.json'),
  )

  useEffect(() => {
    const controller = new AbortController()

    function handleMouseMove(e: MouseEvent) {
      if (!armsRef.current || !dotRef.current) return

      const x = (e.clientX - centerX) / scaleFactor
      const y = (e.clientY - centerY) / scaleFactor

      dotRef.current.position.x = x
      dotRef.current.position.y = y

      crosshairPosition.x = x
      crosshairPosition.y = y

      if (
        Vector.magnitudeSquared(crosshairPosition) > MAX_TARGET_DISTANCE_SQUARED
      ) {
        const normalizedDirection = Vector.normalise(crosshairPosition)
        crosshairPosition.x = normalizedDirection.x * MAX_TARGET_DISTANCE
        crosshairPosition.y = normalizedDirection.y * MAX_TARGET_DISTANCE
      }

      armsRef.current.position.x = crosshairPosition.x
      armsRef.current.position.y = crosshairPosition.y
    }

    window.addEventListener('mousemove', handleMouseMove, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [])

  const rimRef = useRef<Container>(null)

  useEffect(() => {
    Events.on(engine, 'beforeUpdate', () => {
      applyMovementForce(playerA, crosshairPosition)
    })

    Events.on(engine, 'collisionStart', ({ pairs }) => {
      const collisions: CollisionPoint[] = []

      pairs.forEach((pair) =>
        pair.contacts.forEach(({ vertex }) => {
          if (vertex?.x && vertex?.y) {
            collisions.push({ x: vertex.x, y: vertex.y })
          }
        }),
      )

      setCollisionPoints((c) => [...c, ...collisions])
    })

    return () => {
      Events.off(engine, 'beforeUpdate')
      Events.off(engine, 'collisionStart')
    }
  }, [])

  useTick(({ deltaMS }) => {
    if (!playerARef.current || !playerBRef.current) return

    updateEngine(deltaMS)

    playerARef.current.position = playerA.position
    playerBRef.current.position = playerB.position

    playerARef.current.rotation = deltaMS
    playerBRef.current.rotation = deltaMS
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
              g.stroke(arenaStroke).lineTo(end.x - start.x, end.y - start.y)
            }
          />
        ))}

        <pixiGraphics
          label='Circle (outer)'
          draw={(g) => {
            g.fill(0x0e0d0f)
              .stroke(arenaStroke)
              .circle(0, 0, OUTER_CIRCLE_RADIUS)
          }}
        />
        <pixiGraphics
          label='Circle (inner)'
          draw={(g) => {
            g.stroke({ width: 1, color: 0x1d2627 }).circle(
              0,
              0,
              INNER_CIRCLE_RADIUS,
            )
          }}
        />
      </pixiContainer>
      <pixiContainer visible={true}>
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
              g.fill(0x66ccff)
              g.stroke({ width: 2, color: 0x003366 })
            }}
          />
        ))}
      </pixiContainer>

      {spritesheet && (
        <>
          {collisionPoints.map(({ x, y }, index) => (
            <SmallSpark
              key={index}
              x={x}
              y={y}
              rotation={Math.atan2(y, x)}
              textures={spritesheet.animations['spark-small']}
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

          <pixiContainer
            label='Top'
            ref={playerARef}
            x={playerA.position.x}
            y={playerA.position.y}>
            <pixiSprite
              label='Top'
              anchor={0.5}
              texture={spritesheet.textures['top']}
              tint={0xffd87b}
            />
            <pixiSprite
              label='Bit Chip'
              anchor={0.5}
              position={{ x: 0, y: 0 }}
              texture={spritesheet.textures['bitchip']}
            />
            <pixiContainer
              ref={rimRef}
              label='Rim'
              blendMode='add'
              visible={false}>
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
          </pixiContainer>
          <pixiContainer
            label='Top2'
            ref={playerBRef}
            x={playerB.position.x}
            y={playerB.position.y}>
            <pixiSprite
              label='Top'
              anchor={0.5}
              texture={spritesheet.textures['top']}
              tint={0xffffff}
            />
            <pixiSprite
              label='Bit Chip'
              anchor={0.5}
              position={{ x: 0, y: 0 }}
              texture={spritesheet.textures['bitchip-muted']}
            />
          </pixiContainer>
        </>
      )}
    </pixiContainer>
  )
}

function getPerpendicular(vector: TMatter.Vector) {
  return { x: vector.y, y: -vector.x }
}

type SparkProps = PixiReactElementProps<typeof AnimatedSprite> & {
  x: number
  y: number
}

function SmallSpark(props: SparkProps) {
  const ref = useRef<AnimatedSprite>(null)

  const perp = getPerpendicular({ x: props.x, y: props.y })
  const velocityScale = 0.2

  const velocity = {
    x: velocityScale * (-0.5 * perp.x + 5 - 10 * Math.random()),
    y: velocityScale * (-0.5 * perp.y + 5 - 10 * Math.random()),
  }
  const decay = 0.1 + 0.2 * Math.random()

  useEffect(() => {
    if (!ref.current) return
    ref.current.play()
  }, [ref.current])

  useTick(() => {
    if (!ref.current) return

    ref.current.position.x += decay * velocity.x
    ref.current.position.y += decay * velocity.y
  })

  return (
    <pixiAnimatedSprite
      {...props}
      ref={ref}
      label='Spark (small)'
      anchor={0.5}
      blendMode='add'
      animationSpeed={2}
      loop={false}
    />
  )
}

function BigSpark(props: SparkProps) {
  const ref = useRef<AnimatedSprite>(null)

  const perp = getPerpendicular({ x: props.x, y: props.y })
  const velocityScale = 0.2

  const velocity = {
    x: velocityScale * (-0.5 * perp.x + 5 - 10 * Math.random()),
    y: velocityScale * (-0.5 * perp.y + 5 - 10 * Math.random()),
  }
  const decay = 0.1 + 0.2 * Math.random()

  useEffect(() => {
    if (!ref.current) return
    ref.current.play()
  }, [ref.current])

  useTick(() => {
    if (!ref.current) return

    ref.current.position.x += decay * velocity.x
    ref.current.position.y += decay * velocity.y
  })

  return (
    <pixiAnimatedSprite
      {...props}
      label='Spark (big)'
      anchor={{ x: 0.5, y: 0.6 }}
      blendMode='add'
      animationSpeed={1}
      loop={false}
    />
  )
}
