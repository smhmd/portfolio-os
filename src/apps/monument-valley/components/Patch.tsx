import type { ThreeElements } from '@react-three/fiber'
import { PlaneGeometry } from 'three'

import { HALF_PI } from 'src/lib/math'

import { type Materials, materials } from '../lib/materials'

const planeGeo = new PlaneGeometry(1, 1)

const PATCH_OFFSET = 0.0001

const faces = {
  x: { position: [PATCH_OFFSET, 0.5, 0.5], rotation: [0, HALF_PI, 0] },
  y: { position: [-0.5, 1 + PATCH_OFFSET, 0.5], rotation: [-HALF_PI, 0, 0] },
  z: { position: [-0.5, 0.5, 1 + PATCH_OFFSET], rotation: [0, 0, 0] },
  '-x': { position: [-1 - PATCH_OFFSET, 0.5, 0.5], rotation: [0, -HALF_PI, 0] },
  '-y': { position: [-0.5, -PATCH_OFFSET, 0.5], rotation: [HALF_PI, 0, 0] },
  '-z': { position: [-0.5, 0.5, -PATCH_OFFSET], rotation: [0, Math.PI, 0] },
} as const

export type PatchProps = ThreeElements['group'] & {
  /** axis passing through the center of this face */
  axis: keyof typeof faces
  debug?: boolean
  material?: Materials
}

export function Patch({
  axis,
  debug,
  material = 'base',
  layers,
  ...props
}: PatchProps) {
  return (
    <group {...props}>
      <mesh
        layers={layers}
        geometry={planeGeo}
        material={debug ? materials.debug : materials[material]}
        {...faces[axis]}
      />
    </group>
  )
}
