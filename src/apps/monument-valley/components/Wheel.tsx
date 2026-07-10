import React, { useLayoutEffect, useRef } from 'react'

import { type ThreeElements } from '@react-three/fiber'
import { animate } from 'motion/react'
import type { Group } from 'three'
import { BoxGeometry, CylinderGeometry, Object3D } from 'three'

import { HALF_PI, PI } from 'src/lib/math'

import { materials } from '../lib/materials'

export type WheelProps = ThreeElements['group'] & {
  axis?: keyof typeof orientation
  target: React.RefObject<Object3D>
  handle: React.RefObject<Object3D>
  locked: boolean
  drag: ThreeElements['mesh']['onPointerDown']
}

const orientation = {
  x: { rotation: undefined },
  y: { rotation: [0, 0, HALF_PI] },
  z: { rotation: [0, -HALF_PI, 0] },
  '-x': { rotation: [0, 0, PI] },
  '-y': { rotation: [0, 0, -HALF_PI] },
  '-z': { rotation: [0, HALF_PI, 0] },
} as const

const handleGeometry = new CylinderGeometry(1.3, 1.3, 1, 6)
const axleGeometry = new BoxGeometry(1, 0.2, 0.2)
const knobGeometry = new CylinderGeometry(0.4, 0.4, 0.5, 48)
const rodGeometry = new CylinderGeometry(0.08, 0.08, 2, 24)
const armGeometry = new CylinderGeometry(0.14, 0.14, 0.3, 24)

const KNOB_SPACE = 0.6
const ARM_SPACE = 1

export function Wheel({
  axis = 'x',
  target,
  handle,
  locked,
  layers,
  drag,
  children,
  position,
  ...props
}: WheelProps) {
  const { rotation } = orientation[axis]

  const armRefs = useRef<(Group | null)[]>([])

  useLayoutEffect(() => {
    const y = locked ? 0.45 : 1
    armRefs.current.forEach((group) => {
      if (group) animate(group.scale, { y }, { duration: 0.2, ease: 'easeOut' })
    })
  }, [locked])

  return (
    <group position={[0.5, 0.5, 0.5]}>
      <group position={position} ref={target} rotation={rotation} {...props}>
        <mesh
          visible={false}
          layers={2}
          key='handle'
          ref={handle}
          material={materials.debug}
          position={[KNOB_SPACE, 0, 0]}
          rotation={[0, 0, HALF_PI]}
          geometry={handleGeometry}
          onPointerDown={drag}
        />

        <mesh
          layers={layers}
          key='axle'
          material={materials.base}
          geometry={axleGeometry}
        />

        <mesh
          layers={layers}
          key='knob'
          material={materials.base2}
          position={[KNOB_SPACE, 0, 0]}
          rotation={[0, 0, HALF_PI]}
          geometry={knobGeometry}
        />

        <mesh
          layers={layers}
          key='ornament'
          scale={0.5}
          material={materials.accent}
          position={[KNOB_SPACE + 0.1253, 0, 0]}
          rotation={[0, 0, HALF_PI]}
          geometry={knobGeometry}
        />

        {[0, HALF_PI].map((rx, i) => (
          <group
            ref={(el) => {
              armRefs.current[i] = el
            }}
            key={`rod-${rx}`}
            rotation={[rx, 0, 0]}>
            <mesh
              layers={layers}
              material={materials.base}
              position={[KNOB_SPACE, 0, 0]}
              geometry={rodGeometry}
            />

            {[ARM_SPACE, -ARM_SPACE].map((y) => (
              <mesh
                layers={layers}
                key={`arm-${y}`}
                material={materials.accent}
                position={[KNOB_SPACE, y, 0]}
                geometry={armGeometry}
              />
            ))}
          </group>
        ))}
        <group position={[-0.5, -0.5, -0.5]}>{children}</group>
      </group>
    </group>
  )
}
