import { TAU } from 'src/lib'

import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

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

// Having small triangles causes a visual artifact that we just have to deal with for now
const faces = [
  // big triangles:
  [10, 0, 8],
  [11, 1, 3],
  [10, 2, 0],
  [11, 3, 5],
  [10, 4, 2],
  [11, 5, 7],
  [10, 6, 4],
  [11, 7, 9],
  [10, 8, 6],
  [11, 9, 1],
  // small triangles:
  [1, 0, 2],
  [1, 2, 3],
  [3, 2, 4],
  [3, 4, 5],
  [5, 4, 6],
  [5, 6, 7],
  [7, 6, 8],
  [7, 8, 9],
  [9, 8, 0],
  [9, 0, 1],
]

// This would be cool to use to have real kite faces
// But our current implementation uses polar mapping (not planar mapping)
// And because kites aren't uniformly triangular, the UVs get distorted
// If we can figure out planar mapping, we should definitely switch to it (and remove normalLimit)
// const faces = [
//   // kites:
//   [10, 0, 9, 8],
//   [11, 1, 2, 3],
//   [10, 2, 1, 0],
//   [11, 3, 4, 5],
//   [10, 4, 3, 2],
//   [11, 5, 6, 7],
//   [10, 6, 5, 4],
//   [11, 7, 8, 9],
//   [10, 8, 7, 6],
//   [11, 9, 0, 1],
// ]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
  vOffset: 0.04,
  normalLimit: 10,
})

const materials = createMaterials({
  background: BACKGROUNDS[10],
  labels,
})

export const d10 = {
  geometry,
  normals,
  materials,
} satisfies DiceObject
