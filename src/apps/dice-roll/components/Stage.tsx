import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, type Camera } from 'three'

import { ZOOM } from '../lib'
import { Lights } from './Lights'

const Scene = lazy(() => import('./Scene'))

export function Stage() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{
        fov: ZOOM,
        position: [0, ZOOM, 0],
        near: 0.1,
        far: 1000,
        onUpdate(self: Camera) {
          self.lookAt(0, 6, 0)
        },
      }}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}>
      <Suspense fallback={null}>
        <Lights />
        <Scene />
      </Suspense>
    </Canvas>
  )
}
