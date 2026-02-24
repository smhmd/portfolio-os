import type { RigidBodyProps } from '@react-three/rapier'

import { createCtx } from 'src/utils'

import type { Variant } from '../lib'

export type Dice = {
  id: string
  variant: Variant
} & RigidBodyProps

export interface DiceContextType {
  dice: Array<Dice>
  addDice(variant: Variant): void
  removeDice(id: string): void
}

export const [DiceContext, useDice] = createCtx<DiceContextType>()
