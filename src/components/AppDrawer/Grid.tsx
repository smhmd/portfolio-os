import { memo, useMemo, useReducer } from 'react'

import clsx from 'clsx'
import { AnimatePresence } from 'motion/react'

import { appGrid, type AppID } from 'src/apps'

import { GridFolder } from './GridFolder'
import { GridItem } from './GridItem'

type AppGridProps = {
  filter?: AppID[]
  onAppClick?(e: React.MouseEvent): void
}

function foldersReducer(state: Record<string, boolean>, folder: string) {
  return {
    ...state,
    [folder]: !state[folder],
  }
}

export const Grid = memo(({ filter, onAppClick }: AppGridProps) => {
  const [expandedFolders, expand] = useReducer(foldersReducer, {})

  const fullGrid = useMemo(() => {
    return appGrid.flatMap((item) => {
      if (Array.isArray(item)) {
        const [name, apps] = item
        return expandedFolders[name] ? [item, ...apps] : [item]
      } else return item
    })
  }, [expandedFolders])

  const gridItems = filter ?? fullGrid

  return (
    <ul
      id='applications-navigation-list'
      aria-live='polite'
      aria-atomic='true'
      className={clsx(
        'flex flex-wrap items-start justify-between',
        'w-full max-w-7xl',
        '*:w-1/4 sm:*:w-1/5 md:*:w-1/5',
        'gap-4 sm:gap-6 md:gap-8',
      )}>
      <AnimatePresence mode='popLayout'>
        {gridItems.map((id) => {
          if (typeof id === 'string') {
            return <GridItem onClick={onAppClick} key={`app-${id}`} id={id} />
          }

          const [name, ids] = id
          const isExpanded = expandedFolders[name]
          return (
            <GridFolder
              key={`folder-${name}`}
              name={name}
              ids={ids}
              isExpanded={isExpanded}
              onClick={() => {
                expand(name)
              }}
            />
          )
        })}
      </AnimatePresence>

      {/* Flexbox hack to for consistent wrapping */}
      {Array.from({ length: 6 }, (_, i) => (
        <li aria-hidden key={`spacer-${i}`} />
      ))}
    </ul>
  )
})

Grid.displayName = 'AppGrid'
