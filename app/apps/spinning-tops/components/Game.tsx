import { useEffect, useReducer, useRef } from 'react'

import { type PixiReactElementProps, useTick } from '@pixi/react'
import type TMatter from 'matter-js'
import Matter from 'matter-js'
import { AnimatedSprite, Assets, Container, Sprite, Spritesheet } from 'pixi.js'

import { useAsync } from 'app/hooks'

import { useViewport } from '../lib'

const { Engine, Composite, Body, Bodies, Vector, Events } = Matter

const VISIBLE_WALLS = true

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
  const magnitude =
    -MOVEMENT_FORCE_SCALE * Math.min(Vector.magnitudeSquared(direction), 10)

  Body.applyForce(body, body.position, Vector.mult(normal, magnitude))
}

function checkBoundaryCollision(position: TMatter.Vector) {
  const magnitude = Vector.magnitude(position)
  const inContact = magnitude >= OUTER_CIRCLE_RADIUS - PLAYER_RADIUS

  if (inContact) {
    return Vector.mult(position, BOUNDARY_BOUNCE_FORCE_SCALE)
  }
}

function checkCollision(a: TMatter.Vector, b: TMatter.Vector) {
  const delta = Vector.sub(b, a)
  const magnitude = Vector.magnitude(delta)

  const collisionDistance = PLAYER_RADIUS * 2
  const inContact = magnitude < collisionDistance

  if (inContact) {
    return Vector.mult(delta, PLAYER_BOUNCE_FORCE_SCALE)
  }
}

function applyAddedForce(pair: TMatter.Pair) {
  const { bodyA, bodyB, collision } = pair

  const contactPoint = collision.supports[0]
  const normal = Vector.neg(collision.normal)

  const relativeVelocity = Vector.sub(bodyB.velocity, bodyA.velocity)
  const speedDifference = ADDED_FORCE_SCALE * Vector.magnitude(relativeVelocity)

  Body.applyForce(bodyA, contactPoint, Vector.mult(normal, -speedDifference))
  Body.applyForce(bodyB, contactPoint, Vector.mult(normal, speedDifference))
}

type CollisionPoint = {
  id: string
  position: TMatter.Vector
  delta: TMatter.Vector
}

export function Game() {
  const { centerX, centerY, scaleFactor } = useViewport()

  const dotRef = useRef<Sprite>(null)
  const armsRef = useRef<Sprite>(null)
  const playerRef = useRef<Container>(null)
  const computerRef = useRef<Container>(null)

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

    window.addEventListener('mousemove', handleMouseMove, {
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [])

  const rimRef = useRef<Container>(null)

  const collisionQueue = useRef<TMatter.Pair[]>([])

  useEffect(() => {
    Events.on(engine, 'collisionStart', ({ pairs }) => {
      for (const pair of pairs) {
        if (pair.bodyA.isStatic || pair.bodyB.isStatic) continue

        collisionQueue.current.push(pair)
      }
    })

    Events.on(engine, 'beforeUpdate', () => {
      applyMovementForce(player, crosshair)
      // applyMovementForce(computer, player.position) // TODO: enhance

      while (collisionQueue.current.length > 0) {
        const pair = collisionQueue.current.shift()!
        applyAddedForce(pair)
      }
    })

    return () => {
      Events.off(engine, 'beforeUpdate')
      Events.off(engine, 'collisionStart')
    }
  }, [])

  type State = { small: CollisionPoint[]; big: CollisionPoint[] }
  type Actions =
    | { type: 'add'; payload: Omit<CollisionPoint, 'id'> }
    | { type: 'remove'; payload: string }

  const [sparks, send] = useReducer(
    (state: State, action: Actions) => {
      if (action.type === 'add') {
        return {
          small: [
            ...state.small,
            { id: crypto.randomUUID(), ...action.payload },
            { id: crypto.randomUUID(), ...action.payload },
          ],
          big: [...state.big, { id: crypto.randomUUID(), ...action.payload }],
        }
      }

      if (action.type === 'remove') {
        return {
          small: state.small.filter(({ id }) => id !== action.payload),
          big: state.big.filter(({ id }) => id !== action.payload),
        }
      }

      return state
    },
    { small: [], big: [] },
  )

  useTick(({ deltaMS, deltaTime }) => {
    if (!playerRef.current || !computerRef.current || !rimRef.current) return
    updateEngine(deltaMS)

    const playerBoundaryCollision = checkBoundaryCollision(player.position)

    if (playerBoundaryCollision) {
      send({
        type: 'add',
        payload: {
          delta: playerBoundaryCollision,
          position: player.position,
        },
      })
    }

    const computerBoundaryCollision = checkBoundaryCollision(computer.position)

    if (computerBoundaryCollision) {
      send({
        type: 'add',
        payload: {
          delta: computerBoundaryCollision,
          position: computer.position,
        },
      })
    }

    const playersCollision = checkCollision(player.position, computer.position)

    if (playersCollision) {
      send({
        type: 'add',
        payload: {
          delta: playersCollision,
          position: player.position,
        },
      })

      rimRef.current.visible = true
      setTimeout(() => {
        if (!rimRef.current) return
        rimRef.current.visible = false
      }, 500)

      send({
        type: 'add',
        payload: {
          delta: Vector.neg(playersCollision),
          position: computer.position,
        },
      })
    }

    playerRef.current.position = player.position
    computerRef.current.position = computer.position

    playerRef.current.rotation += 0.25 * deltaTime
    computerRef.current.rotation += 0.25 * deltaTime
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
          {sparks.small.map((spark) => (
            <SmallSpark
              onComplete={() => {
                send({ type: 'remove', payload: spark.id })
              }}
              key={spark.id}
              {...spark}
              textures={spritesheet.animations['spark-small']}
            />
          ))}
          {sparks.big.map((spark) => (
            <BigSpark
              onComplete={() => {
                send({ type: 'remove', payload: spark.id })
              }}
              key={spark.id}
              {...spark}
              textures={spritesheet.animations['spark-big']}
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
            ref={playerRef}
            x={player.position.x}
            y={player.position.y}>
            <pixiContainer visible={true}>
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
            </pixiContainer>
            <pixiContainer
              visible={false}
              ref={rimRef}
              label='Rim'
              blendMode='add'>
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
          <pixiContainer
            label='Top2'
            ref={computerRef}
            x={computer.position.x}
            y={computer.position.y}>
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

type SparkProps = PixiReactElementProps<typeof AnimatedSprite> & CollisionPoint

function SmallSpark({ id, delta, position, ...props }: SparkProps) {
  const sparkRef = useRef<AnimatedSprite>(null)

  const perp = Vector.perp(delta, true)
  const velocity = {
    x: -0.5 * perp.x + 5 - 10 * Math.random(),
    y: -0.5 * perp.y + 5 - 10 * Math.random(),
  }
  const decay = 0.4 + 0.5 * Math.random()

  useEffect(() => {
    if (!sparkRef.current) return
    sparkRef.current.play()
  }, [])

  useTick(() => {
    if (!sparkRef.current) return
    sparkRef.current.position.x += decay * velocity.x
    sparkRef.current.position.y += decay * velocity.y
  })

  return (
    <pixiAnimatedSprite
      ref={sparkRef}
      x={position.x + delta.x}
      y={position.y + delta.y}
      rotation={Math.atan2(delta.y, delta.x)}
      label='Spark (small)'
      anchor={0.5}
      blendMode='add'
      animationSpeed={2}
      loop={false}
      {...props}
    />
  )
}

function BigSpark({ id, delta, position, ...props }: SparkProps) {
  const sparkRef = useRef<AnimatedSprite>(null)

  const perp = Vector.perp(delta, true)
  const velocity = {
    x: -0.2 * perp.x + 5 - 10 * Math.random(),
    y: -0.2 * perp.y + 5 - 10 * Math.random(),
  }
  const decay = 0.4 + 0.5 * Math.random()

  useEffect(() => {
    if (!sparkRef.current) return
    sparkRef.current.play()
  }, [])

  useTick(() => {
    if (!sparkRef.current) return
    sparkRef.current.position.x += decay * velocity.x
    sparkRef.current.position.y += decay * velocity.y
  })

  return (
    <pixiAnimatedSprite
      ref={sparkRef}
      x={position.x + delta.x}
      y={position.y + delta.y}
      rotation={Math.PI + Math.atan2(delta.y, delta.x)}
      label='Spark (big)'
      anchor={{ x: 0.5, y: 0.6 }}
      blendMode='add'
      animationSpeed={1}
      loop={false}
      {...props}
    />
  )
}
