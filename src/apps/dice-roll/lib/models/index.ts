import type { DiceObject, Variant } from '../common'
import { d4 } from './d4'
import { d6 } from './d6'
import { d8 } from './d8'
import { d10 } from './d10'
import { d12 } from './d12'
import { d20 } from './d20'
import { d100 } from './d100'

export const variants: Record<Variant, DiceObject> = {
  4: d4,
  6: d6,
  8: d8,
  10: d10,
  12: d12,
  20: d20,
  100: d100,
}
