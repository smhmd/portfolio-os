import { useEffect } from 'react'

import Matter from 'matter-js'

import { useMatter } from 'app/contexts'
import { HALF_PI, PI, TAU } from 'app/lib'

import {
  BARRIER_ANGLE,
  BARRIER_COUNT,
  BARRIER_RADIUS,
  OUTER_CIRCLE_RADIUS,
} from '../lib'

/**
 * Terminology:
 * Barrier: A raised part of the arena that stops the spinning tops from flying out.
 * Boundary: the individual physics bodies alongside the barrier that absorb the collision. There are many of them that tilt to make an arc (because matter-js does not support arched boundaries)
 */

const { Bodies } = Matter

const VISIBLE_CIRCLES = true
const VISIBLE_BOUNDARY = false
const BOUNDARY_COLORS = [0xff00ff, 0x00ffff, 0xffff00, 0xff0000, 0x00ff00]

const INNER_CIRCLE_RADIUS = OUTER_CIRCLE_RADIUS * 0.5

/**
 * Decorative lines inside the arena.
 */
const INNER_ARENA_LINES = Array.from({ length: BARRIER_COUNT }, (_, i) => {
  const angle = (TAU / BARRIER_COUNT) * i + HALF_PI
  const x = Math.cos(angle) * OUTER_CIRCLE_RADIUS
  const y = Math.sin(angle) * OUTER_CIRCLE_RADIUS
  return { x, y }
})

/**
 * The outermost arc that defines the top of the barrier
 */
const BARRIER_ARC = Array.from({ length: BARRIER_COUNT }, (_, i) => ({
  start: (2 * i + 1) * BARRIER_ANGLE,
  end: (2 * i + 2) * BARRIER_ANGLE,
}))

/**
 * The vectors denoting the ends/corners of the barrier arcs
 */
const BARRIER_CORNERS = Array.from({ length: BARRIER_COUNT * 2 }, (_, i) => ({
  x: BARRIER_RADIUS * Math.cos(i * BARRIER_ANGLE),
  y: BARRIER_RADIUS * Math.sin(i * BARRIER_ANGLE),
}))

/**
 * Lines being drawn from corner to corner to connect the barrier with the circle (visually)
 */
const BARRIER_CORNER_LINES = Array.from({ length: BARRIER_COUNT }, (_, i) => ({
  start: BARRIER_CORNERS[2 * i],
  end: BARRIER_CORNERS[2 * i + 1],
}))

const BOUNDARY_PER_BARRIER = 10
const BOUNDARY_COUNT = BOUNDARY_PER_BARRIER * BARRIER_COUNT
const BOUNDARY_ANGLE = PI / BOUNDARY_COUNT
const BOUNDARY_SIZE = OUTER_CIRCLE_RADIUS * BOUNDARY_ANGLE
const BOUNDARY_RADIUS = OUTER_CIRCLE_RADIUS + BOUNDARY_SIZE / 2

const offset = (BOUNDARY_PER_BARRIER - 1) / 2

const boundaries = Array.from({ length: BOUNDARY_COUNT }, (_, index) => {
  // we get the index of the barrier. For 3 barriers, this would be 0, 1, or 2
  const barrierIndex = Math.floor(index / BOUNDARY_PER_BARRIER)
  // we calculate the position of the boundary, and subtract `offset` to center them
  const position = (index % BOUNDARY_PER_BARRIER) - offset

  // we calculate the angle that each barrier will tilt with to make an arc alongside the barrier angle
  const angle = 2 * barrierIndex * BARRIER_ANGLE + position * BOUNDARY_ANGLE
  const x = -BOUNDARY_RADIUS * Math.sin(angle)
  const y = BOUNDARY_RADIUS * Math.cos(angle)
  return {
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3)),
    angle,
  }
})

const boundaryBodies = boundaries.map(({ x, y, angle }) => {
  return Bodies.rectangle(x, y, BOUNDARY_SIZE, BOUNDARY_SIZE, {
    restitution: 0,
    angle,
    isStatic: true,
  })
})

const outerStroke = { width: 2, color: 0x314344 }
const innerStroke = { width: 1, color: 0x1d2627 }

export function Arena() {
  const { addBody } = useMatter()

  useEffect(() => {
    boundaryBodies.forEach((body) => {
      addBody(body)
    })
  }, [])

  return (
    <pixiContainer label='Arena'>
      <pixiGraphics
        label='Arcs'
        draw={(g) => {
          BARRIER_ARC.forEach(({ start, end }) => {
            g.arc(0, 0, BARRIER_RADIUS, start, end)
          })
          g.stroke(outerStroke)
        }}
      />

      <pixiGraphics
        label='Lines'
        draw={(g) => {
          BARRIER_CORNER_LINES.forEach(({ start, end }) => {
            g.moveTo(start.x, start.y).lineTo(end.x, end.y)
          })
          g.stroke(outerStroke)
        }}
      />

      <pixiGraphics
        visible={VISIBLE_CIRCLES}
        label='Circle (outer)'
        draw={(g) => {
          g.fill(0x0e0d0f).circle(0, 0, OUTER_CIRCLE_RADIUS).stroke(outerStroke)
        }}
      />

      <pixiGraphics
        label='Inner Lines'
        draw={(g) => {
          INNER_ARENA_LINES.forEach(({ x, y }) => {
            g.moveTo(0, 0).lineTo(x, y)
          })
          g.stroke(innerStroke)
        }}
      />

      <pixiGraphics
        visible={VISIBLE_CIRCLES}
        label='Circle (inner)'
        draw={(g) => {
          g.fill(0x0e0d0f).circle(0, 0, INNER_CIRCLE_RADIUS).stroke(innerStroke)
        }}
      />

      <pixiContainer visible={VISIBLE_BOUNDARY}>
        {boundaries.map((box, i) => {
          const section = Math.floor(i / BOUNDARY_PER_BARRIER)
          return (
            <pixiGraphics
              key={box.angle}
              alpha={0.4}
              x={box.x}
              y={box.y}
              rotation={box.angle}
              draw={(g) => {
                g.clear()
                g.rect(
                  -BOUNDARY_SIZE / 2,
                  -BOUNDARY_SIZE / 2,
                  BOUNDARY_SIZE,
                  12,
                )
                g.fill(BOUNDARY_COLORS[section])
              }}
            />
          )
        })}
      </pixiContainer>
    </pixiContainer>
  )
}
