import { Addition, Base, Geometry, Subtraction } from '@react-three/csg'

import { HALF_PI, PI } from 'src/lib/math'

import { HDRIBox } from './HDRIBox'

const height = 4.17,
  back = 5.85,
  front = 8.7,
  right = 4.425,
  left = 4.425

export function Room() {
  return (
    <HDRIBox
      path='/images/studio.exr'
      size={{
        height,
        back,
        front,
        right,
        left,
      }}
      rotation={HALF_PI}
      origin={[-0.25, 2, 0]}
      scale={0.9}>
      <Geometry>
        <Base>
          <boxGeometry args={[left + right, height, front + back]} />
        </Base>

        <Subtraction
          key='right-far-corner'
          position={[right, 0, -(back + front) / 2]}>
          <boxGeometry args={[1, height, 0.98]} />
        </Subtraction>

        <Subtraction key='rear-corner' position={[right, 0, back / 2]}>
          <boxGeometry args={[0.97, height, 2.7]} />
        </Subtraction>

        <Subtraction key='right-entrance' position={[right, 0, back]}>
          <boxGeometry args={[3.05, height, 7.55]} />
        </Subtraction>

        <Subtraction key='left-entrance' position={[-left, 0, back]}>
          <boxGeometry args={[2, height, 7.5]} />
        </Subtraction>

        <Subtraction key='overhead' position={[0, 1.9, 2.075]} rotation-y={PI}>
          <planeGeometry args={[7.1, 1.04]} />
        </Subtraction>

        <Addition key='window' position={[-left, -0.017, -2.6]}>
          <boxGeometry args={[0.25, height - 0.035, 8.3]} />
        </Addition>

        <Addition key='ceiling' position={[-0.25, height / 2, -2.64]}>
          <boxGeometry args={[4.5, 0.23, 7.12]} />
        </Addition>

        <Addition key='hallway' position={[3, -0.72 / 2, front - 2.665]}>
          <boxGeometry args={[2.3, height - 0.72, 2.48]} />
        </Addition>
      </Geometry>
    </HDRIBox>
  )
}
