export function isOdd(n: number) {
  return n % 2 !== 0
}

export function isEven(n: number) {
  return n % 2 == 0
}

export function uuid(): string {
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  let byteIndex = 0
  let nibbleToggle = false // false => low nibble, true => high nibble

  function getNextNibble() {
    const byte = randomBytes[byteIndex]
    const nibble = nibbleToggle ? (byte >> 4) & 0xf : byte & 0xf
    nibbleToggle = !nibbleToggle
    if (!nibbleToggle) byteIndex++
    return nibble
  }

  return template.replace(/[xy]/g, (char) => {
    let value
    if (char === 'x') {
      value = getNextNibble()
    } else {
      // 'y' character: high bits must be 8, 9, a, or b
      value = (getNextNibble() & 0x3) | 0x8
    }
    return value.toString(16)
  })
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
  const t = Math.min(Math.max((value - fromA) / range, 0), 1)

  // Resolve easing function
  const ease = typeof easing === 'function' ? easing : easings[easing]

  return toA + (toB - toA) * ease(t)
}
