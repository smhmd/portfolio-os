import { forwardRef } from 'react'
import { Link } from 'react-router'

import clsx from 'clsx'
import { type HTMLMotionProps, type Transition } from 'motion/react'
import * as motion from 'motion/react-client'

import { type AppID, apps } from 'app/apps'

import { AppIconWrapper } from '../AppIcon'

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

const spring: Transition = {
  type: 'spring',
  damping: 24,
  stiffness: 300,
}

type GridIconProps = {
  name: string
  disableAnimation?: boolean
  className?: string
  children: React.ReactNode
} & HTMLMotionProps<'li'>

const exit = { opacity: 0, scale: 0.8, transition: { duration: 0.1 } }

const GridIcon = forwardRef<HTMLLIElement, GridIconProps>(
  ({ name, className, disableAnimation, children, ...props }, ref) => {
    return (
      <motion.li
        ref={ref}
        className={clsx(
          'group/icon',
          'relative flex cursor-pointer flex-col items-center justify-center gap-2',
          className,
        )}
        layout
        exit={disableAnimation ? undefined : exit}
        whileHover={{ scale: 1.05 }}
        transition={spring}
        {...props}>
        {children}
        <span className='line-clamp-2 h-[2lh] text-center text-xs font-medium text-white sm:text-sm'>
          {name}
        </span>
      </motion.li>
    )
  },
)

GridIcon.displayName = 'GridIcon'

type GridAppIconProps = { id: AppID; disableAnimation?: boolean }

const iconClassName =
  'size-18 transition-transform group-active:scale-90 sm:size-28'

export const GridAppIcon = forwardRef<HTMLLIElement, GridAppIconProps>(
  ({ id, disableAnimation }, ref) => {
    const { name, Icon, description } = apps[id]
    return (
      <GridIcon
        name={name}
        ref={ref}
        disableAnimation={disableAnimation}
        title={description}>
        <Link
          className='absolute inset-0 z-50 cursor-pointer'
          tabIndex={0}
          prefetch='intent'
          to={`/${id}`}></Link>
        <span aria-hidden className={iconClassName}>
          <Icon />
        </span>
      </GridIcon>
    )
  },
)

GridAppIcon.displayName = 'GridAppIcon'

type GridFolderIconProps = {
  name: string
  ids: AppID[]
  onClick?: (e: React.MouseEvent) => void
  isExpanded: boolean
  disableAnimation?: boolean
}

export const GridFolderIcon = forwardRef<HTMLLIElement, GridFolderIconProps>(
  ({ name, ids, isExpanded, onClick, disableAnimation }, ref) => {
    return (
      <GridIcon
        name={name}
        ref={ref}
        className={clsx(
          'transition-opacity',
          isExpanded ? 'opacity-50!' : 'opacity-100',
        )}
        disableAnimation={disableAnimation}>
        <button
          className='absolute inset-0 z-50 cursor-pointer'
          tabIndex={0}
          onClick={onClick}
          aria-expanded={isExpanded}
          aria-label={`${name} folder, ${ids.length} apps`}
        />
        <span aria-hidden className={iconClassName}>
          <AppIconWrapper>
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
          </AppIconWrapper>
        </span>
      </GridIcon>
    )
  },
)

GridFolderIcon.displayName = 'GridFolderIcon'
