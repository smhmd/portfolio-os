import { TAU } from 'src/lib/math'

import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const sides = 10
const step = TAU / sides
const offset = 0.105

const vertices = Array.from({ length: 10 }, (_, i) => {
  const angle = i * step
  const sign = (-1) ** i
  const z = -sign * offset
  return [Math.cos(angle), Math.sin(angle), z]
}).concat([
  [0, 0, -1],
  [0, 0, 1],
])

const faces = [
  [10, 0, 9, 8],
  [11, 1, 2, 3],
  [10, 2, 1, 0],
  [11, 3, 4, 5],
  [10, 4, 3, 2],
  [11, 5, 6, 7],
  [10, 6, 5, 4],
  [11, 7, 8, 9],
  [10, 8, 7, 6],
  [11, 9, 0, 1],
]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
  uvScale: 0.6,
  vOffset: -0.05,
})

const materials = createMaterials({
  background: BACKGROUNDS[10],
})

export const d10 = {
  geometry,
  normals,
  materials,
} satisfies DiceObject
