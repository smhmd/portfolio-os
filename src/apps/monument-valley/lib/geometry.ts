import { BufferAttribute, BufferGeometry } from 'three'

import { rand, TAU } from 'src/lib/math'

const STAR_COUNT = 100
const CONSTELLATION_COUNT = 6

const MIN_LINES = 5 // min lines per constellation
const MAX_LINES = 7 // max lines per constellation
const ASPECT = window.innerWidth / window.innerHeight // Aspect used to correct distance in NDC.

type Star = {
  x: number
  y: number
  size: number
  phase: number
}

const distSq = (a: Star, b: Star) => {
  const dx = (a.x - b.x) * ASPECT
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

/**
 * This builds a "natural looking" network of lines between stars.
 * - Start with one star
 * - Repeatedly connect the closest new star
 * - Avoid cycles (no loops)
 */
const mst = (members: Star[]) => {
  const tree = [members[0]] // stars already in the constellation
  const candidates = members.slice(1) // stars not yet connected
  const connections: [Star, Star][] = [] // resulting lines

  // Keep adding the closest star until all are connected
  while (candidates.length) {
    let from = tree[0]
    let pick = 0
    let best = Infinity

    // Find closest pair
    for (const a of tree) {
      for (const [j, b] of candidates.entries()) {
        const d = distSq(a, b)
        if (d < best) {
          best = d
          from = a
          pick = j
        }
      }
    }

    connections.push([from, candidates[pick]])

    // Move chosen star into the tree
    tree.push(candidates.splice(pick, 1)[0])
  }

  return connections
}

const field: Star[] = Array.from({ length: STAR_COUNT }, () => ({
  x: rand(1, -1), // full horizontal range
  y: rand(1, 0), // only upper half of screen
  size: rand(6, 2), // random size
  phase: rand(TAU, 0), // random twinkling animation desync
}))

/**
 * We take random groups of stars and turn them into "constellations".
 * - Pick a "seed" position in X
 * - Find closest star to that seed
 * - Grab nearby stars
 * - Run MST to create clean connections
 * - Stars are removed from the pool once used to prevent overlapping
 */
const pool = [...field]
const edges: [Star, Star][] = []

for (let column = 0; column < CONSTELLATION_COUNT; column++) {
  if (pool.length < 2) break

  // Pick a random X in the constellation column
  const cx = -1 + ((column + Math.random()) / CONSTELLATION_COUNT) * 2

  // Find star closest to that X position
  const seed = pool.reduce((b, s) =>
    Math.abs(s.x - cx) < Math.abs(b.x - cx) ? s : b,
  )

  // Decide how many stars to include in this constellation
  const target = Math.floor(rand(MAX_LINES + 1, MIN_LINES))

  // Sort by distance to seed (closest first)
  pool.sort((a, b) => distSq(seed, a) - distSq(seed, b))

  // Take closest stars and build MST connections
  edges.push(...mst(pool.splice(0, target)))
}

const starPositions = new Float32Array(field.flatMap((s) => [s.x, s.y, 0]))
const sizes = new Float32Array(field.map((s) => s.size))
const phases = new Float32Array(field.map((s) => s.phase))

const linePositions = new Float32Array(
  edges.flatMap(([a, b]) => [a.x, a.y, 0, b.x, b.y, 0]),
)

const stars = new BufferGeometry()
stars.setAttribute('position', new BufferAttribute(starPositions, 3))
stars.setAttribute('aSize', new BufferAttribute(sizes, 1))
stars.setAttribute('aPhase', new BufferAttribute(phases, 1))

const lines = new BufferGeometry()
lines.setAttribute('position', new BufferAttribute(linePositions, 3))

export const geometries = { stars, lines }
