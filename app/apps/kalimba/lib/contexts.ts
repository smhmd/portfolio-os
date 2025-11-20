import type * as THREE from 'three'

import { createCtx } from 'app/utils'

import type { Options } from './common'
import type { Recorder } from './recorder'

export interface OptionsContextType {
  options: Options
  setOption(payload: { option: keyof Options; value: number }): void
}

export interface RecorderContextType {
  recordingRef: React.RefObject<boolean>
  record(): void
  play(): Promise<boolean>
  reset(): void
  recorder: Recorder
}

export interface InstrumentContextType {
  mascotRef: React.RefObject<THREE.Mesh | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  animation: string
  playNote(payload: { index: number; note: string; octave: number }): void
}

export const [OptionsContext, useOptions] = createCtx<OptionsContextType>()
export const [RecorderContext, useRecorder] = createCtx<RecorderContextType>()
export const [InstrumentContext, useInstrument] =
  createCtx<InstrumentContextType>()
