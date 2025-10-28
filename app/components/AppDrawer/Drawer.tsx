import { useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { matchSorter } from 'match-sorter'
import { Dialog } from 'radix-ui'

import { appIDs } from 'app/apps'
import { Search } from 'app/assets'
import { useGlobals } from 'app/contexts'

import { AppDrawerButton } from './Button'
import { AppGrid } from './Grid'

export const AppDrawer = () => {
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const { isAppDrawerOpen } = useGlobals()
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  const [search, setSearch] = useState('')
  const filteredApps = useMemo(() => matchSorter(appIDs, search), [search])

  useEffect(() => {
    isAppDrawerOpen.current = open
    if (open) return
    setTimeout(() => setSearch(''), 200)
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AppDrawerButton />
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(
            'backdrop-blur-xs fixed inset-0 bg-black/60',
            'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
          )}
        />
        <Dialog.Content
          className={clsx(
            'pointer-events-none fixed inset-0 flex cursor-auto flex-col items-center p-2 sm:p-8',
            'data-[state=open]:animate-fade-scale-up data-[state=closed]:animate-fade-scale-down',
          )}>
          <Dialog.Close className='fixed inset-0 outline-none' />
          <Dialog.Title className='sr-only'>Applications</Dialog.Title>
          <Dialog.Description className='sr-only'>
            Navigate all applications
          </Dialog.Description>
          <form
            onClick={stopPropagation}
            role='search'
            aria-label='Search Applications'>
            <label
              className={clsx(
                'relative mb-4 flex w-full rounded-lg',
                'border border-white/20 bg-white/10 backdrop-blur-xl transition-colors',
                'focus-within:border-white/40 sm:mb-8',
              )}>
              <span className='sr-only'>Search</span>
              <input
                autoFocus
                id='app-search'
                value={search}
                autoComplete='off'
                autoCorrect='off'
                spellCheck='false'
                aria-controls='applications-navigation-list'
                aria-expanded={filteredApps.length > 0}
                onChange={(e) => setSearch(e.target.value)}
                type='search'
                placeholder='Search...'
                className='h-6 w-full px-2 py-1 text-[10px] capitalize text-white placeholder-white/50 focus:outline-none'
              />
              <span className='mr-1 mt-px flex items-center justify-center'>
                <Search aria-hidden className='size-4 fill-white/50' />
              </span>
            </label>
          </form>
          <AppGrid
            apps={search ? filteredApps : undefined}
            onClick={handleClose}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
