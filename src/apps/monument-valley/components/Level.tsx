import { memo } from 'react'

import { useWheel } from '../lib/hooks'
import { Box, Pillars } from './Box'
import { Door } from './Door'
import { Patch } from './Patch'
import { PressurePlate } from './PressurePlate'
import { Wheel } from './Wheel'

type LevelProps = {
  solved: boolean
  wheel: ReturnType<typeof useWheel>
}

export const Level = memo(({ solved, wheel }: LevelProps) => {
  return (
    <group>
      <PressurePlate layers={1} pressed={solved} position={[0, 8, -4]} />
      <Box layers={1} y={7} position={[0, 1, -4]} />
      <Box layers={1} z={4} position={[0, 0, -4]} />

      <Box layers={1} y={3} position={[0, 1, 0]} />
      <Patch layers={2} axis='z' position={[0, 1, 0]} />
      <Patch layers={2} axis='z' position={[0, 2, 0]} />

      <Box layers={1} x={8} position={[0, 0, 0]} />

      <Pillars layers={2} y={6} position={[-7, 1, 0]} />
      <Patch layers={2} axis='z' position={[-6, 7, 0]} />
      <Patch layers={2} axis='z' position={[-7, 7, 0]} />

      <Box layers={1} z={3} position={[-7, 0, -3]} />
      <Patch layers={1} axis='y' position={[0, 7, 4]} />
      <Patch layers={1} axis='x' position={[0, 7, 4]} />

      <Wheel
        layers={1}
        axis='x'
        position={[0, 7, 0]}
        target={wheel.target}
        handle={wheel.handle}
        locked={wheel.locked}
        drag={wheel.drag}>
        <Box layers={1} material='accent' x={4} position={[0, 0, 0]} />
        <Box layers={1} material='accent' y={3} position={[0, -3, 0]} />
        <group
          // although non-reactive, using this ref here is fine
          // since Ida animation is reactive and this is not high priority.
          visible={wheel.position.current === 2}>
          <Patch layers={2} material='accent' axis='-z' position={[0, -1, 0]} />
          <Patch layers={2} material='accent' axis='-z' position={[0, -2, 0]} />
        </group>
      </Wheel>

      <Box layers={1} x={4} position={[-11, 0, -7]} />
      <Box layers={1} z={5} position={[-14, 0, -12]} />

      <Door layers={2} open={solved} position={[-14, 1, -12]} />
    </group>
  )
})

Level.displayName = 'Level'
