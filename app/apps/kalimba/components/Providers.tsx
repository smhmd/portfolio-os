import React, { useCallback, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'

import { animate } from 'motion/react'
import type * as THREE from 'three'

import { useDebounced } from '~/hooks'
import { gpuTier } from '~/lib'
import { interpolate, isEven } from '~/utils'

import {
  Instrument,
  type InstrumentContextType,
  KALIMBA_SOUNDS,
  ROTATION_X,
  ROTATION_Y,
  ROTATION_Z,
  useOptions,
} from '../lib'
import { InstrumentContext, type Options, OptionsContext } from '../lib'

const kalimba = new Instrument(KALIMBA_SOUNDS)

type OptionsProviderProps = React.PropsWithChildren

export function OptionsProvider({ children }: OptionsProviderProps) {
  const hi = useLoaderData()
  console.log(hi)
  const [options, setOptions] = useState<Options>({
    color: 10,
    labelType: 0,
    tines: 17,
    tuning: 4,
    reverb: 0,
  })

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOption({ option, value }) {
          setOptions((prev) => ({ ...prev, [option]: value }))
        },
      }}>
      {children}
    </OptionsContext.Provider>
  )
}

export function InstrumentProvider({ children }: React.PropsWithChildren) {
  const { options } = useOptions()

  const [animation, setAnimation] = useState('1')

  const mascotRef = useRef<THREE.Mesh>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const resetAnim = useDebounced(() => setAnimation('1'), 1000)
  const resetRotation = useDebounced(() => {
    if (!mascotRef.current) return
    const reset = animate(
      mascotRef.current.rotation,
      { x: 0, y: 0, z: 0 },
      { duration: 0.4 },
    )

    if (gpuTier < 0) reset.complete()
  }, 1400)

  const playNote = useCallback<InstrumentContextType['playNote']>(
    ({ index, note, octave }) => {
      if (!mascotRef.current) return
      if (!containerRef.current) return

      kalimba.play(`${note}${octave}`)

      if (index < 0) return

      let rotation = interpolate(index, [0, options.tines - 1], [0, 1])
      rotation = isEven(index) ? rotation : -rotation

      if (gpuTier > 0) {
        const rotate = animate(
          mascotRef.current.rotation,
          {
            x: -Math.abs(rotation * ROTATION_X),
            y: rotation * ROTATION_Y,
            z: rotation * ROTATION_Z,
          },
          { duration: 0.4 },
        )
        if (gpuTier < 1) rotate.complete()

        const bounce = animate(
          containerRef.current,
          { scaleY: [0.9, 1], scaleX: [1.1, 1] },
          {
            type: 'spring',
            stiffness: 200,
            damping: 4,
            mass: 0.4,
          },
        )
        if (gpuTier < 1) bounce.complete()
      }

      const newAnim = Math.min(
        6,
        Math.max(2, Math.floor(Math.abs(rotation) * 8)),
      ).toString()
      setAnimation(newAnim)

      resetAnim()
      resetRotation()
    },
    [options.tines],
  )

  return (
    <InstrumentContext.Provider
      value={{
        mascotRef,
        containerRef,
        animation,
        playNote,
      }}>
      {children}
    </InstrumentContext.Provider>
  )
}
