import { Physics } from '@react-three/rapier'

import { Bounds } from './Bounds'
import { Dice } from './Dice'
import { Floor } from './Floor'

export default function Scene() {
  return (
    <Physics gravity={[0, -9.81, 0]}>
      <Dice />
      <Floor />
      <Bounds />
    </Physics>
  )
}
