import { useLayoutEffect, useRef } from 'react'

import { animate } from 'motion/react'
import { CircleGeometry, Mesh, RingGeometry } from 'three'

import { HALF_PI, interpolate } from 'src/lib/math'

import { materials } from '../lib/materials'

type Props = {
  position?: readonly [number, number, number]
}

const dotGeo = new CircleGeometry(0.13, 32)
const ringGeo = new RingGeometry(0.86, 1, 64)

const dotMat = materials.white.clone()
const ringMat = materials.white.clone()

// 0→1 over first 15%, hold, 1→0 over last 30%
const pulse = (t: number) => Math.min(t / 0.15, (1 - t) / 0.3, 1)

export function TapIndicator({ position }: Props) {
  const dot = useRef<Mesh>(null!)
  const ring = useRef<Mesh>(null!)

  useLayoutEffect(() => {
    const anim = animate(0, 1, {
      duration: 1.2,
      onUpdate: (t) => {
        dot.current.scale.setScalar(interpolate(t, [0, 0.3], [0.5, 1]))
        dotMat.opacity = interpolate(t, [0, 1], [0, 1], pulse)

        ring.current.scale.setScalar(interpolate(t, [0, 0.55], [0.13, 1]))
        ringMat.opacity = interpolate(t, [0, 0.55], [0.85, 0])
      },
    })
    return () => anim.stop()
  }, [])

  return (
    <group position={position} rotation={[-HALF_PI, 0, 0]}>
      <mesh
        layers={1}
        ref={dot}
        geometry={dotGeo}
        material={dotMat}
        material-opacity={0}
        scale={0.5}
      />
      <mesh
        layers={1}
        ref={ring}
        geometry={ringGeo}
        material={ringMat}
        material-opacity={0}
        scale={0.13}
      />
    </group>
  )
}
