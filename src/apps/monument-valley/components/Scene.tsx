import { useLayers } from '../lib/hooks'
import { Bounds } from './Bounds'
import { Game } from './Game'
import { Stars } from './Stars'

export default function Scene() {
  useLayers(3)

  return (
    <Bounds mx={1.5} my={0.75} position={[2, -7.5, 0]}>
      <Stars />
      <Game />
    </Bounds>
  )
}
