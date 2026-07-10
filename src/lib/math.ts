export const PI = Math.PI
export const TAU = Math.PI * 2

export const HALF_PI = Math.PI / 2
export const THIRD_PI = Math.PI / 3
export const QUARTER_PI = Math.PI / 4
export const THREE_QUARTER_PI = (3 * Math.PI) / 4

export function isOdd(n: number) {
  return n % 2 !== 0
}

export function isEven(n: number) {
  return n % 2 == 0
}

export function clamp(min: number, value: number, max: number) {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(min, value), max)
}

export function magnitude(v: { x: number; y: number; z: number }) {
  return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2)
}

/* Defaults to a random number between -1 and 1 */
export function rand(
  max = 1,
  min = -max,
  easing: EasingName | EasingFunction = 'linear',
): number {
  return interpolate(Math.random(), [0, 1], [min, max], easing)
}

type EasingFunction = (t: number) => number

const easings = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => 1 - (1 - t) * (1 - t),
  'ease-in-out': (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
} satisfies Record<string, EasingFunction>

type EasingName = keyof typeof easings

/**
 * Maps a number from one range to another, with optional easing and clamping.
 *
 * @param value - The input value.
 * @param from - The source range [min, max].
 * @param to - The target range [min, max].
 * @param easing - Easing name or custom easing function. Default: 'linear'.
 * @returns The mapped value.
 */
export function interpolate(
  value: number,
  from: [number, number],
  to: [number, number],
  easing: EasingName | EasingFunction = 'linear',
): number {
  const [fromA, fromB] = from
  const [toA, toB] = to
  const range = fromB - fromA

  if (range === 0) throw new Error('Source range cannot have zero length')

  // Clamp and normalize to [0, 1]
  const normal = clamp(0, (value - fromA) / range, 1)

  // Resolve easing function
  const ease = typeof easing === 'function' ? easing : easings[easing]

  return toA + (toB - toA) * ease(normal)
}
