import { memo, useMemo, useReducer } from 'react'

import clsx from 'clsx'
import { AnimatePresence } from 'motion/react'

import { appGrid, type AppGridArray } from 'app/apps'

import { GridAppIcon, GridFolderIcon } from './GridIcon'

type AppGridProps = {
  apps?: AppGridArray
  onClick?: (e: React.MouseEvent) => void
}

export const AppGrid = memo(({ apps, onClick }: AppGridProps) => {
  const [expandedFolders, toggle] = useReducer(
    (state: Record<string, boolean>, folder: string) => ({
      ...state,
      [folder]: !state[folder],
    }),
    {},
  )

  const fullGrid = useMemo(() => {
    const result: AppGridArray = []
    appGrid.forEach((item) => {
      result.push(item)
      if (Array.isArray(item)) {
        const [name, apps] = item
        if (expandedFolders[name]) {
          result.push(...apps)
        }
      }
    })
    return result
  }, [expandedFolders])

  const gridItems = apps ?? fullGrid

  return (
    <ul
      id='applications-navigation-list'
      aria-live='polite'
      aria-atomic='true'
      className={clsx(
        'flex flex-wrap items-start justify-between',
        'md:*:w-1/7 *:w-1/5 sm:*:w-1/6',
        'w-full max-w-7xl gap-3 sm:gap-6 md:gap-8',
      )}>
      <AnimatePresence mode='popLayout'>
        {gridItems.map((id) => {
          if (typeof id === 'string') {
            return <GridAppIcon key={`app-${id}`} id={id} />
          } else {
            const [name, ids] = id
            const isExpanded = expandedFolders[name]
            return (
              <GridFolderIcon
                key={`folder-${name}`}
                name={name}
                ids={ids}
                isExpanded={isExpanded}
                onClick={(e) => {
                  onClick?.(e)
                  toggle(name)
                }}
              />
            )
          }
        })}
      </AnimatePresence>
      {Array.from({ length: 6 }, (_, i) => (
        <li aria-hidden key={`spacer-${i}`} />
      ))}
    </ul>
  )
})

AppGrid.displayName = 'AppGrid'
