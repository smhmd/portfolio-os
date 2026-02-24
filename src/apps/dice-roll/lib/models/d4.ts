import { PI } from 'src/lib'

import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const labels = [
  ['2', '4', '3'],
  ['1', '3', '4'],
  ['2', '1', '4'],
  ['1', '2', '3'],
]

const vertices = [
  [1, 1, 1],
  [-1, -1, 1],
  [-1, 1, -1],
  [1, -1, -1],
]

const faces = [
  [1, 0, 2],
  [0, 1, 3],
  [0, 3, 2],
  [1, 2, 3],
]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
  uvScale: 0.55,
  angleOffset: PI * (7 / 6),
})

const materials = createMaterials({
  labels,
  background: BACKGROUNDS[4],
})

export const d4 = {
  geometry,
  normals,
  materials,
} satisfies DiceObject
