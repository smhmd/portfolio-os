import { clamp, HALF_PI, PI, TAU } from 'src/lib/math'

export const SIDES = 6
export const CAGE_RADIUS = 100 // world units, scaled to fit the screen at render time
export const BALL_RADIUS = 6
export const ROD_LENGTH = CAGE_RADIUS * Math.sin(PI / SIDES) // half-length of one rod
export const MAX_BALLS = 8

const APOTHEM = CAGE_RADIUS * Math.cos(PI / SIDES) // center → rod midpoint
const SPIN_RATE = 0.4 // rad/s per spin unit (spin knob lives in -10..10)
const MAX_GRAVITY = 1200 // px/s² at full knob
const MAX_ROD_ANGLE = HALF_PI // rods knob at 1 turns every rod 90° open
const ESCAPE_RADIUS = 350 // balls past this are offscreen and get cleaned up
const MIN_IMPACT = 40 // px/s — softer touches bounce silently

export type Ball = {
  note: string
  x: number
  y: number
  vx: number
  vy: number
}
export type Hit = { note: string; impact: number }
export type Params = {
  spin: number // -10..10, snapped to integers so a displayed 0 is truly still
  gravity: number // 0..1
  bounce: number // 0..1
  rods: number // 0..1, how far each rod is rotated open
}

export const tombola = {
  angle: 0,
  balls: [] as Ball[],

  add(note: string) {
    if (this.balls.length === MAX_BALLS) this.balls.shift()
    const direction = Math.random() * TAU
    this.balls.push({
      note,
      x: 0,
      y: 0,
      vx: Math.cos(direction) * 60,
      vy: Math.sin(direction) * 60,
    })
  },

  clear() {
    this.balls.length = 0
  },

  /** Midpoint and direction of one rod — shared by physics and rendering. */
  rodAt(side: number, rods: number) {
    const theta = this.angle + ((side + 0.5) * TAU) / SIDES // rod midpoint direction
    const phi = theta + HALF_PI + rods * MAX_ROD_ANGLE // rod orientation
    return {
      mx: Math.cos(theta) * APOTHEM,
      my: Math.sin(theta) * APOTHEM,
      dx: Math.cos(phi),
      dy: Math.sin(phi),
    }
  },

  /** Advance the simulation by `dt` seconds and report hits. */
  step(dt: number, { spin, gravity, bounce, rods }: Params) {
    const hits: Hit[] = []
    const omega = Math.round(spin) * SPIN_RATE // the HUD shows the rounded value
    const restitution = 0.2 + bounce * 0.75
    this.angle += omega * dt

    for (const ball of this.balls) {
      ball.vy += gravity * MAX_GRAVITY * dt
      ball.x += ball.vx * dt
      ball.y += ball.vy * dt

      // Each side is a free-standing rod (segment), so balls can slip
      // through the corner gaps once the rods are rotated open.
      for (let side = 0; side < SIDES; side++) {
        const { mx, my, dx, dy } = this.rodAt(side, rods)

        // Closest point on the rod to the ball
        const s = clamp(
          -ROD_LENGTH,
          (ball.x - mx) * dx + (ball.y - my) * dy,
          ROD_LENGTH,
        )
        const cx = mx + dx * s
        const cy = my + dy * s
        const ex = ball.x - cx
        const ey = ball.y - cy
        const distance = Math.hypot(ex, ey)
        if (distance === 0 || distance >= BALL_RADIUS) continue

        // Push out along the contact normal
        const nx = ex / distance
        const ny = ey / distance
        ball.x += nx * (BALL_RADIUS - distance)
        ball.y += ny * (BALL_RADIUS - distance)

        // Reflect relative to the moving rod, so the spin flings balls around
        const rodVx = -omega * cy
        const rodVy = omega * cx
        const impact = (ball.vx - rodVx) * nx + (ball.vy - rodVy) * ny
        if (impact >= 0) continue // already separating

        ball.vx -= (1 + restitution) * impact * nx
        ball.vy -= (1 + restitution) * impact * ny
        if (-impact > MIN_IMPACT)
          hits.push({ note: ball.note, impact: -impact })
      }
    }

    // Ball ↔ ball — equal masses, so they trade velocity along the contact normal
    for (let a = 0; a < this.balls.length; a++) {
      for (let b = a + 1; b < this.balls.length; b++) {
        const A = this.balls[a]
        const B = this.balls[b]
        const dx = B.x - A.x
        const dy = B.y - A.y
        const distance = Math.hypot(dx, dy)
        if (distance === 0 || distance >= BALL_RADIUS * 2) continue

        const nx = dx / distance
        const ny = dy / distance
        const overlap = (BALL_RADIUS * 2 - distance) / 2
        A.x -= nx * overlap
        A.y -= ny * overlap
        B.x += nx * overlap
        B.y += ny * overlap

        const closing = (A.vx - B.vx) * nx + (A.vy - B.vy) * ny
        if (closing <= 0) continue // already separating

        const impulse = ((1 + restitution) * closing) / 2
        A.vx -= impulse * nx
        A.vy -= impulse * ny
        B.vx += impulse * nx
        B.vy += impulse * ny

        if (closing > MIN_IMPACT) {
          hits.push(
            { note: A.note, impact: closing },
            { note: B.note, impact: closing },
          )
        }
      }
    }

    // Escaped balls are gone for good
    this.balls = this.balls.filter(
      ({ x, y }) => x * x + y * y < ESCAPE_RADIUS ** 2,
    )

    return hits
  },
}
