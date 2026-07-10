import type { ThreeElements } from '@react-three/fiber'
import { CylinderGeometry, RingGeometry } from 'three'

import { HALF_PI, PI } from 'src/lib/math'

import { materials } from '../lib/materials'

type PlatformProps = ThreeElements['group'] & {
  pressed: boolean
}

const baseGeo = new CylinderGeometry(0.4, 0.4, 0.1, 8)
const ringGeo = new RingGeometry(0.24, 0.4, 8)

export function PressurePlate({ pressed, layers, ...props }: PlatformProps) {
  return (
    <group {...props}>
      <group position={[-0.5, 0, 0.5]}>
        <mesh
          layers={layers}
          geometry={baseGeo}
          material={pressed ? materials.base2 : materials.accent}
          rotation-y={PI / 9}
        />
        <mesh
          layers={layers}
          geometry={ringGeo}
          scale={0.7}
          material={pressed ? materials.base : materials.base3}
          position-y={0.0501}
          rotation={[-HALF_PI, 0, PI / 9]}
        />
      </group>
    </group>
  )
}
