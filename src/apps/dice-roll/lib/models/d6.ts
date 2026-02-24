import { QUARTER_PI } from 'src/lib'

import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const vertices = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
]

const faces = [
  [0, 3, 2, 1],
  [1, 2, 6, 5],
  [0, 1, 5, 4],
  [3, 7, 6, 2],
  [0, 4, 7, 3],
  [4, 5, 6, 7],
]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
  angleOffset: -QUARTER_PI,
  vOffset: 0.02,
})

const materials = createMaterials({
  background: BACKGROUNDS[6],
})

export const d6 = {
  geometry,
  normals,
  materials,
  colliders: 'cuboid',
} satisfies DiceObject
