import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'
import { AgXToneMapping } from 'three'

import { isMobile } from 'src/lib/env'

import { CAMERA_FOV, CAMERA_POSITION, CAMERA_TARGET } from '../lib/common'

const Lights = lazy(() => import('./Lights'))
const Scene = lazy(() => import('./Scene'))

export function Stage() {
  return (
    <Canvas
      // PointerLockControls locks on clicks inside this element only (see
      // Interact), so clicking HUD chrome never grabs the cursor.
      id='stage'
      className='bg-black'
      shadows
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{ antialias: true, toneMapping: AgXToneMapping }}
      camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_TARGET)}>
      <Suspense fallback={null}>
        <Lights />
        <Scene />
      </Suspense>
    </Canvas>
  )
}
