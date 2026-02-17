import { useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import { PI, QUARTER_PI, TAU } from 'app/lib'

import { ZOOM } from '../lib'
import { Bounds } from './Bounds'
import { Dice } from './Dice'
import { Floor } from './Floor'

export default function Scene() {
  return (
    <>
      <Lights />
      <World />
    </>
  )
}

function Lights() {
  const {
    viewport: { width, height },
  } = useThree()

  return (
    <>
      <directionalLight
        position={[width / 2, ZOOM, 0]}
        intensity={QUARTER_PI}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-width}
        shadow-camera-right={width}
        shadow-camera-top={height}
        shadow-camera-bottom={-height}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
      />
      <ambientLight intensity={TAU} />

      <pointLight position={[0, ZOOM, 0]} decay={QUARTER_PI} intensity={PI} />
    </>
  )
}

function World() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Dice />
      <Floor />
      <Bounds />
    </Physics>
  )
}
