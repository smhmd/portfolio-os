import { DoubleSide, MeshBasicMaterial, MeshStandardMaterial } from 'three'

import { textures } from './textures'

const COLORS = ['#AAA', '#CCC', '#EEE', '#E11D48']

const [base, base2, base3, accent] = COLORS.map(
  (color) =>
    new MeshStandardMaterial({
      color,
      flatShading: true,
    }),
)

const white = new MeshBasicMaterial({
  color: 'white',
  transparent: true,
  depthWrite: false,
  depthTest: false,
})

const debug = new MeshBasicMaterial({
  wireframe: true,
})

const radial = new MeshBasicMaterial({
  map: textures.radial,
  transparent: true,
  depthWrite: false,
})

const gradient = new MeshBasicMaterial({
  map: textures.gradient,
  transparent: true,
  depthWrite: false,
  side: DoubleSide,
})

const door = accent.clone()
door.map = textures.door
door.bumpMap = textures.door
door.bumpScale = 2

export const materials = {
  base,
  base2,
  base3,
  accent,
  white,
  debug,
  door,
  radial,
  gradient,
}

export type Materials = keyof typeof materials
