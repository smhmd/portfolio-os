import type { RigidBodyAutoCollider } from '@react-three/rapier'
import type {
  BufferGeometry,
  MeshPhongMaterial,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Vector3,
} from 'three'

export const DICE_FONT_NAME = 'UnifrakturCook'
export const WALL_COLOR = 'hsl(140, 80%, 30%)'
export const ZOOM = 30
export const DEPTH = 0.5
export const HALF_ZOOM = ZOOM / 2

export const DEFAULT_LABELS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
]

export const BACKGROUNDS = {
  4: 'Crimson',
  6: 'Orange',
  8: 'Aqua',
  10: 'DeepSkyBlue',
  12: 'PaleGreen',
  20: 'MediumPurple',
  100: 'Tomato',
}

export type Variant = keyof typeof BACKGROUNDS

export type DiceObject = {
  geometry: BufferGeometry<NormalBufferAttributes>
  normals: Vector3[]
  materials: Array<MeshStandardMaterial | MeshPhongMaterial>
  colliders?: RigidBodyAutoCollider
}
