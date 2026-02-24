'use client'

import { lazy, Suspense, useMemo, useReducer } from 'react'

import { useThree } from '@react-three/fiber'

import { PADDING, SMILE_TEXTURE } from '../lib'

const Mascot = lazy(() => import('./Mascot'))

export function Scene() {
  const [isFallback, hideFallback] = useReducer(() => false, true)

  const {
    viewport: { width, height },
  } = useThree()

  const radius = useMemo(
    () => Math.min(width, height) / 2 - PADDING,
    [width, height],
  )

  return (
    <>
      {isFallback && (
        <mesh>
          <circleGeometry args={[radius, 64]} />
          <meshBasicMaterial map={SMILE_TEXTURE} />
        </mesh>
      )}
      <Suspense>
        <Mascot radius={radius} onRender={hideFallback} />
      </Suspense>
    </>
  )
}
