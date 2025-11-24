import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLoaderData } from 'react-router'

import { animate } from 'motion/react'
import type * as THREE from 'three'

import { useDebounced } from 'app/hooks'
import { gpuTier } from 'app/lib'
import { interpolate, isEven, setCookie } from 'app/utils'

import {
  Instrument,
  InstrumentContext,
  type InstrumentContextType,
  KALIMBA_SAMPLE,
  type Options,
  OptionsContext,
  Recorder,
  RecorderContext,
  ROTATION_X,
  ROTATION_Y,
  ROTATION_Z,
  useOptions,
  useRecorder,
} from '../lib'

const instrument = new Instrument(KALIMBA_SAMPLE)
const recorder = new Recorder()

type OptionsProviderProps = React.PropsWithChildren

export function OptionsProvider({ children }: OptionsProviderProps) {
  const data = useLoaderData<string>()

  const [options, setOptions] = useState<Options>(() => {
    const [color, labelType, tines, tuning, reverb] = data
      ? data.split(',').map(Number)
      : [10, 0, 17, 4, 0]

    return {
      color,
      labelType,
      tines,
      tuning,
      reverb,
    }
  })

  useEffect(() => {
    const { color, labelType, tines, tuning, reverb } = options
    const value = `${color},${labelType},${tines},${tuning},${reverb}`

    setCookie('kalimba.options', value)
  }, [options])

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

export function RecorderProvider({ children }: React.PropsWithChildren) {
  const recordingRef = useRef(false)

  function record() {
    recordingRef.current = true
    // recorder.start will be executed on the next playNote
    // to avoid having silence at the start
  }

  async function play() {
    recordingRef.current = false
    return await recorder.play()
  }

  function reset() {
    recordingRef.current = false
    recorder.reset()
  }

  useEffect(() => reset, [])

  return (
    <RecorderContext.Provider
      value={{
        recordingRef,
        record,
        play,
        reset,
        recorder,
      }}>
      {children}
    </RecorderContext.Provider>
  )
}

export function InstrumentProvider({ children }: React.PropsWithChildren) {
  const { options } = useOptions()
  const { recordingRef, recorder } = useRecorder()
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

      if (recordingRef.current) {
        recorder.record()
        recordingRef.current = false
      }

      instrument.play(`${note}${octave}`)

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
