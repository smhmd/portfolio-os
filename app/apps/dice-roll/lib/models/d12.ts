import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const p = (1 + Math.sqrt(5)) / 2
const q = 1 / p

const vertices = [
  [0, q, p],
  [0, q, -p],
  [0, -q, p],
  [0, -q, -p],
  [p, 0, q],
  [p, 0, -q],
  [-p, 0, q],
  [-p, 0, -q],
  [q, p, 0],
  [q, -p, 0],
  [-q, p, 0],
  [-q, -p, 0],
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
]

const faces = [
  [2, 14, 4, 12, 0],
  [15, 9, 11, 19, 3],
  [16, 10, 17, 7, 6],
  [6, 7, 19, 11, 18],
  [6, 18, 2, 0, 16],
  [18, 11, 9, 14, 2],
  [1, 17, 10, 8, 13],
  [1, 13, 5, 15, 3],
  [13, 8, 12, 4, 5],
  [5, 4, 14, 9, 15],
  [0, 12, 8, 10, 16],
  [3, 19, 7, 17, 1],
]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
  size: 0.9,
  uvScale: 0.4,
  vOffset: 0.02,
})

const materials = createMaterials({
  background: BACKGROUNDS[12],
})

export const d12 = {
  geometry,
  normals,
  materials,
} satisfies DiceObject
