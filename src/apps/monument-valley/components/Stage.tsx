import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'

import { Lights } from './Lights'

const Scene = lazy(() => import('./Scene'))

export function Stage() {
  return (
    <Canvas
      orthographic
      camera={{
        position: [10, 10, 10],
        zoom: 50,
        near: 0.01,
        far: 5000,
      }}>
      <Suspense fallback={null}>
        <Lights />
        <Scene />
      </Suspense>

      <axesHelper args={[10]} />
      <gridHelper args={[50, 50]} />
    </Canvas>
  )
}
