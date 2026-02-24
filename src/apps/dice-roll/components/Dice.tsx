import { useDice } from '../contexts'
import { Die } from './Die'

export function Dice() {
  const { dice, removeDice } = useDice()
  return dice.map(({ id, ...die }) => (
    <Die key={id} {...die} onClick={() => removeDice(id)} />
  ))
}
