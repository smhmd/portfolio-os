import clsx from 'clsx'

import { type AppID, apps } from 'src/apps'

import { IconFrame } from '../IconFrame'
import { GridIcon, iconClassName } from './GridIcon'

// Constants for grid layout
const SVG_SIZE = 22 // Size of each inner SVG
const GRID_SIZE = 3 // 3x3 grid
const PADDING = 12 // Padding from edges
const TOTAL_USABLE_SPACE = 100 - PADDING * 2 // Space available after padding
const GAP = (TOTAL_USABLE_SPACE - SVG_SIZE * GRID_SIZE) / (GRID_SIZE - 1) // Calculate gap size

// Calculate position based on index
const getPosition = (index: number) => {
  const row = Math.floor(index / GRID_SIZE)
  const col = index % GRID_SIZE

  const x = PADDING + col * (SVG_SIZE + GAP)
  const y = PADDING + row * (SVG_SIZE + GAP)

  return { x, y }
}

type GridFolderProps = {
  name: string
  ids: AppID[]
  onClick?(e: React.MouseEvent): void
  isExpanded: boolean
  // important to keep for animation stability with motion library
  ref?: React.Ref<HTMLLIElement>
}

export function GridFolder({
  ref,
  name,
  ids,
  isExpanded,
  onClick,
}: GridFolderProps) {
  return (
    <GridIcon
      ref={ref}
      name={name}
      className={clsx('transition-opacity', isExpanded && 'opacity-50!')}>
      <button
        className='absolute inset-0 z-50 cursor-pointer'
        tabIndex={0}
        onClick={onClick}
        aria-expanded={isExpanded}
        aria-label={`${name} folder, ${ids.length} apps`}
      />
      <IconFrame aria-hidden fill='#ffffff33' className={iconClassName}>
        {ids.slice(0, 9).map((id, index) => {
          const { x, y } = getPosition(index)

          const Icon = apps[id].Icon
          return (
            <Icon
              x={x}
              y={y}
              width={SVG_SIZE}
              height={SVG_SIZE}
              key={`folder-${name}-app-${id}`}
            />
          )
        })}
      </IconFrame>
    </GridIcon>
  )
}
