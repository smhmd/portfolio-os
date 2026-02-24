import { useThree } from '@react-three/fiber'

import { PI, QUARTER_PI, TAU } from 'app/lib'

import { ZOOM } from '../lib'

export function Lights() {
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
