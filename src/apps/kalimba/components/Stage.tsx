'use client'

import { Canvas } from '@react-three/fiber'
import clsx from 'clsx'
import * as motion from 'motion/react-client'

import { useInstrument, ZOOM } from '../lib'
import { Scene } from './Scene'

type SceneProps = React.ComponentProps<'div'>

export function Stage({ className, ...props }: SceneProps) {
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
          <Scene />
        </Canvas>
      </motion.div>
    </div>
  )
}
