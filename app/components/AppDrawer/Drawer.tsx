import { useEffect, useMemo, useState } from 'react'

import clsx from 'clsx'
import { matchSorter } from 'match-sorter'
import { AnimatePresence, type Variants } from 'motion/react'
import * as motion from 'motion/react-client'
import { Dialog } from 'radix-ui'

import { appIDs } from 'app/apps'
import { Search } from 'app/assets/svg'
import { useGlobalState } from 'app/contexts'

import { AppDrawerButton } from './Button'
import { AppGrid } from './Grid'

const variants = {
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  content: {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  },
} satisfies Record<string, Variants>

export const AppDrawer = () => {
  const { isAppDrawerOpen } = useGlobalState()
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  const [search, setSearch] = useState('')
  const filteredApps = useMemo(() => matchSorter(appIDs, search), [search])

  useEffect(() => {
    isAppDrawerOpen.current = open
    if (open) return
    setSearch('')
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AppDrawerButton />
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className='backdrop-blur-xs fixed inset-0 bg-black/60'
                variants={variants.overlay}
                initial='hidden'
                animate='visible'
                exit='exit'
              />
            </Dialog.Overlay>
            <Dialog.Content onClick={handleClose} asChild>
              <motion.div
                className='fixed inset-0 flex flex-col items-center p-2 sm:p-8'
                initial='hidden'
                animate='visible'
                exit='exit'
                variants={variants.content}>
                <Dialog.Title className='sr-only'>Applications</Dialog.Title>
                <Dialog.Description className='sr-only'>
                  Navigate all applications
                </Dialog.Description>
                <form role='search' aria-label='Search Applications'>
                  <label
                    onClick={stopPropagation}
                    className={clsx(
                      'relative mb-4 flex w-full max-w-[140px] rounded-lg',
                      'border border-white/20 bg-white/10 backdrop-blur-xl transition-colors',
                      'focus-within:border-white/40 sm:mb-8',
                    )}>
                    <span className='sr-only'>Search</span>
                    <input
                      id='app-search'
                      value={search}
                      autoComplete='off'
                      autoCorrect='off'
                      spellCheck='false'
                      aria-controls='applications-navigation-list'
                      aria-expanded={filteredApps.length > 0}
                      onChange={(e) => setSearch(e.target.value)}
                      type='text'
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
                  onClick={stopPropagation}
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  )
}
