import { Object3D } from 'three'

import { Room } from './Room'

const TARGET = new Object3D()

TARGET.position.set(0, 1.2, 1.7)

export default function Lights() {
  return (
    <>
      <Room />

      <spotLight
        castShadow
        target={TARGET}
        position={[-4, 10, 0]}
        angle={0.5}
        penumbra={0.9}
        decay={0}
        intensity={3}
        color='#ffd9ae'
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />

      <directionalLight
        position={[-2, 3.5, 6]}
        intensity={1.4}
        color='#c1b9ff'
      />
    </>
  )
}
