import { BACKGROUNDS, type DiceObject } from '../common'
import { createGeometry } from './geometry'
import { createMaterials } from './material'

const vertices = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

const faces = [
  [0, 2, 4],
  [0, 4, 3],
  [0, 3, 5],
  [0, 5, 2],
  [1, 3, 4],
  [1, 4, 2],
  [1, 2, 5],
  [1, 5, 3],
]

const { geometry, normals } = createGeometry({
  vertices,
  faces,
})

const materials = createMaterials({
  background: BACKGROUNDS[8],
})

export const d8 = {
  geometry,
  normals,
  materials,
} satisfies DiceObject
