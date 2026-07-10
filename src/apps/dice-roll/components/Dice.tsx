import { useDice, useScore } from '../lib'
import { Die } from './Die'

export function Dice() {
  const { dice, remove } = useDice()
  const settle = useScore((s) => s.settle)

  return dice.map((die) => (
    <Die key={die.id} {...die} onRemove={remove} onSettle={settle} />
  ))
}
