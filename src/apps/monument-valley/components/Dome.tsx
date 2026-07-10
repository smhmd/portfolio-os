import type { ThreeElements } from '@react-three/fiber'
import { ConeGeometry } from 'three'

import { QUARTER_PI } from 'src/lib/math'

import { materials } from '../lib/materials'

type DomeProps = ThreeElements['group']

const domeGeo = new ConeGeometry(0.708, 1, 4)

export function Dome({ layers, ...props }: DomeProps) {
  return (
    <group {...props}>
      <mesh
        position={[-0.5, 0.5, 0.5]}
        rotation-y={QUARTER_PI}
        geometry={domeGeo}
        material={materials.accent}
        layers={layers}
      />
    </group>
  )
}
