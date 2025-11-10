import { createContext, useContext } from 'react'

import type * as THREE from 'three'

import { ensureContext } from 'app/utils'

export type Options = {
  color: number
  labelType: number
  tines: number
  tuning: number
  reverb: number
}

export interface OptionsContextType {
  options: Options
  setOption(payload: { option: keyof Options; value: number }): void
}

export const OptionsContext = createContext<OptionsContextType | undefined>(
  undefined,
)

export const useOptions = () => {
  const context = useContext(OptionsContext)
  ensureContext(context)
  return context
}

export interface InstrumentContextType {
  mascotRef: React.RefObject<THREE.Mesh | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  animation: string
  playNote(payload: { index: number; note: string; octave: number }): void
}

export const InstrumentContext = createContext<
  InstrumentContextType | undefined
>(undefined)

export const useInstrument = () => {
  const context = useContext(InstrumentContext)
  ensureContext(context)
  return context
}
