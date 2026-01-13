'use client'

import { lazy, Suspense, useMemo, useReducer } from 'react'

import { Canvas, useThree } from '@react-three/fiber'
import clsx from 'clsx'
import * as motion from 'motion/react-client'

import { PADDING, SMILE_TEXTURE, useInstrument, ZOOM } from '../lib'

const Mascot = lazy(() => import('./Mascot'))

type SceneProps = React.ComponentProps<'div'>

export function Scene({ className, ...props }: SceneProps) {
  const { containerRef } = useInstrument()

  return (
    <div className={clsx('relative w-full', className)} {...props}>
      <motion.div
        initial={{ y: '40vh' }}
        animate={{ y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
          bounce: 0,
        }}
        ref={containerRef}
        className={clsx(
          'top-5/12 absolute left-1/2 -translate-x-1/2 -translate-y-1/2',
          'l:size-[min(64%,18rem)]',
          'p:size-[min(50%,18rem)]',
        )}>
        <Canvas
          orthographic
          camera={{ zoom: ZOOM, position: [0, 0, ZOOM] }}
          gl={{ alpha: true, antialias: true }}>
          <Stage />
        </Canvas>
      </motion.div>
    </div>
  )
}

function Stage() {
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
