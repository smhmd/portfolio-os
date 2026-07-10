import { Physics } from '@react-three/rapier'

import { Bounds } from './Bounds'
import { Dice } from './Dice'

export default function Scene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Dice />
      <Bounds />
    </Physics>
  )
}
