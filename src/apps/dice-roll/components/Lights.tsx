import { useThree } from '@react-three/fiber'

import { ZOOM } from '../lib'

export function Lights() {
  const {
    viewport: { width, height },
  } = useThree()

  return (
    <>
      <directionalLight
        position={[5, ZOOM, 0]}
        intensity={3.5}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-left={-width}
        shadow-camera-right={width}
        shadow-camera-top={height}
        shadow-camera-bottom={-height}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
      />
      <ambientLight intensity={4} />
    </>
  )
}
