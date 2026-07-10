import { type ThreeElements } from '@react-three/fiber'
import { BoxGeometry, RingGeometry } from 'three'

import { HALF_PI, PI } from 'src/lib/math'

import { type Materials, materials } from '../lib/materials'

export type BoxProps = ThreeElements['group'] & {
  x?: number
  y?: number
  z?: number
  debug?: boolean
  material?: Materials
}
const boxGeometry = new BoxGeometry(1, 1, 1)

export function Box({
  x = 1,
  y = 1,
  z = 1,
  debug,
  material = 'base',
  layers,
  ...props
}: BoxProps) {
  return (
    <group {...props}>
      <mesh
        geometry={boxGeometry}
        scale={[x, y, z]}
        position={[-x / 2, y / 2, z / 2]}
        material={debug ? materials.debug : materials[material]}
        layers={layers}
      />
    </group>
  )
}

const ring = new RingGeometry(0.3, 0.5, 10, 1, 0, PI)

export function Pillars({
  x = 0.1,
  y = 0.1,
  z = 0.1,
  position = [0, 0, 0],
  layers,
  ...rest
}: BoxProps) {
  const props = { x, y, z, ...rest }

  return (
    <group position={position}>
      <group position-y={y - 0.3}>
        <mesh
          layers={layers}
          position={[-0.5, 0, 1.001]}
          geometry={ring}
          material={materials.base}
        />
        <mesh
          layers={layers}
          position={[0.001, 0, 0.5]}
          geometry={ring}
          material={materials.base}
          rotation={[0, HALF_PI, 0]}
        />
      </group>

      <Box layers={layers} position={[-0.9, 0, 0.9]} {...props} />
      <Box layers={layers} position={[0, 0, 0.9]} {...props} />
      <Box layers={layers} position={[0, 0, 0]} {...props} />
    </group>
  )
}
