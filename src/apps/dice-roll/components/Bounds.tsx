import { useThree } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'

import { DEPTH, HALF_ZOOM, ZOOM } from '../lib'

export function Bounds() {
  const { viewport } = useThree()

  const width = viewport.width / 2
  const height = viewport.height / 2

  return (
    <RigidBody type='fixed' colliders={false}>
      <CuboidCollider
        key='floor'
        args={[width, DEPTH, height]}
        position={[0, 0, 0]}
      />
      <CuboidCollider
        key='ceiling'
        args={[width, DEPTH, height]}
        position={[0, ZOOM, 0]}
      />
      <CuboidCollider
        key='left'
        args={[DEPTH, HALF_ZOOM, height]}
        position={[-width - DEPTH, HALF_ZOOM, 0]}
      />
      <CuboidCollider
        key='right'
        args={[DEPTH, HALF_ZOOM, height]}
        position={[width + DEPTH, HALF_ZOOM, 0]}
      />
      <CuboidCollider
        key='back'
        args={[width, HALF_ZOOM, DEPTH]}
        position={[0, HALF_ZOOM, -height - DEPTH]}
      />
      <CuboidCollider
        key='front'
        args={[width, HALF_ZOOM, DEPTH]}
        position={[0, HALF_ZOOM, height + DEPTH]}
      />
    </RigidBody>
  )
}
