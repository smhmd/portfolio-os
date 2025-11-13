'use client'

import { lazy, Suspense, useMemo, useReducer } from 'react'

import { Canvas, useThree } from '@react-three/fiber'
import clsx from 'clsx'
import * as motion from 'motion/react-client'
import { DoubleSide, MathUtils } from 'three'

import { DISTANCE, FOV, SMILE_TEXTURE, useInstrument } from '../lib'

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
          className='bg-transparent'
          camera={{ fov: FOV, position: [0, 0, DISTANCE] }}
          gl={{ alpha: true, antialias: true }}>
          <Stage />
        </Canvas>
      </motion.div>
    </div>
  )
}

function Stage() {
  const [isFallback, hideFallback] = useReducer(() => false, true)

  const { size } = useThree()

  const radius = useMemo(() => {
    const vFov = MathUtils.degToRad(FOV)
    const visibleHeight = 2 * Math.tan(vFov / 2) * DISTANCE
    const visibleWidth = visibleHeight * (size.width / size.height)

    return Math.min(visibleHeight, visibleWidth) * 0.99
  }, [size])

  return (
    <>
      {isFallback && (
        <>
          <ambientLight intensity={Math.PI} />
          <mesh position={[0, 0, 0]} scale={0.495}>
            <circleGeometry args={[radius, 64]} />
            <meshStandardMaterial map={SMILE_TEXTURE} side={DoubleSide} />
          </mesh>
        </>
      )}
      <Suspense>
        <Mascot radius={radius} onRender={hideFallback} />
      </Suspense>
    </>
  )
}
