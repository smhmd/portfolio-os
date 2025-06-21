import { useMemo } from 'react'

import { useSelector } from '@xstate/react'
import clsx from 'clsx'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { AdvancedOptions, DropZone, MagnetLink } from './components'
import { Alert } from './components/Alert'
import { actor, compareState, type Options } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={24} />)
  return [favicon, { rel: 'stylesheet', href: styles }]
}

export default function App() {
  const { torrentObject, magnetURI, options, error } = useSelector(
    actor,
    ({ context }) => context,
    compareState,
  )

  const handle = useMemo(
    () => ({
      fileUpload(payload: ArrayBuffer) {
        actor.send({ type: 'torrent.add', payload })
      },
      optionChange(payload: { option: keyof Options; value: boolean }) {
        actor.send({ type: 'option.set', payload })
      },
      selectedFilesChange(payload: Set<number>) {
        actor.send({ type: 'selectedFiles.set', payload })
      },
      reset() {
        actor.send({ type: 'reset' })
      },
    }),
    [],
  )

  return (
    <AppWrapper
      isDark
      className='flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-4 text-white selection:bg-purple-950/40'>
      <div className='flex w-full max-w-2xl flex-col gap-8'>
        <header className='flex flex-col gap-4 text-center'>
          <h1
            aria-label='Torrent Magnetizer'
            className='text-4xl font-bold tracking-tight md:text-5xl'>
            Torr
            <AppIcon
              aria-hidden
              viewBox='24 24 52 52'
              fill='transparent'
              className='inline size-5 md:size-7'
            />
            nt Magnetizer
          </h1>
          <p className='block text-lg text-purple-200 [@media(max-height:700px)]:sr-only'>
            <span>
              Transform your torrent files into magnetic
              <span className='whitespace-nowrap'> energy ⚡</span>
            </span>
          </p>
        </header>

        <section
          aria-label='Torrent conversion panel'
          className={clsx(
            'flex flex-col gap-y-2',
            'rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-8',
          )}>
          {!error ? (
            <DropZone
              torrentObject={torrentObject}
              onFileUpload={handle.fileUpload}
              onReset={handle.reset}
            />
          ) : (
            <Alert
              severity='error'
              message='The file appears to be corrupted or in an unsupported format. Please try a different torrent file.'
              action={{
                label: 'Try Again',
                onClick: handle.reset,
              }}
            />
          )}
          {torrentObject && (
            <div className='flex flex-col gap-y-4'>
              <AdvancedOptions
                torrentObject={torrentObject}
                options={options}
                onOptionChange={handle.optionChange}
                onSelectedFilesChange={handle.selectedFilesChange}
              />
              {magnetURI && <MagnetLink link={magnetURI} />}
            </div>
          )}
        </section>

        <footer className='text-center text-sm text-purple-300 [@media(max-height:700px)]:sr-only'>
          <p>
            Powered by quantum entanglement and
            <span className='whitespace-nowrap'> digital magic ✨</span>
          </p>
        </footer>
      </div>
    </AppWrapper>
  )
}
