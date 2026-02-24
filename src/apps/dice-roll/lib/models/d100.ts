import { BACKGROUNDS, type DiceObject } from '../common'
import { d10 } from './d10'
import { createMaterials } from './material'

const labels = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90']

const materials = createMaterials({
  background: BACKGROUNDS[100],
  labels,
})

// Inherits from d10 and changes background and labels
export const d100 = {
  ...d10,
  materials,
} satisfies DiceObject
