import clsx from 'clsx'
import type { LoaderFunction } from 'react-router'

import { AppWrapper } from 'app/components'
import { getCookie, iconToFavicon } from 'app/utils'

import {
  InstrumentProvider,
  OptionsProvider,
  Panel,
  RecorderProvider,
  Tines,
} from './components'
import { Scene } from './components/Scene'
import { colors, useOptions } from './lib'
import { AppIcon, metadata } from './metadata'
import styles from './styles.css?url'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon padding={8} />)
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap',
    },
    { rel: 'stylesheet', href: styles },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('Cookie') ?? ''
  return getCookie('kalimba.options', cookie)
}

export default function App() {
  return (
    <OptionsProvider>
      <RecorderProvider>
        <InstrumentProvider>
          <Content />
        </InstrumentProvider>
      </RecorderProvider>
    </OptionsProvider>
  )
}

function Content() {
  const { options } = useOptions()

  return (
    <AppWrapper
      isDark
      className={clsx(
        'font-quicksand scrollbar-white font-bold',
        colors[options.color].img,
        'init:bg-cover',
      )}>
      <div
        className={clsx(
          'relative flex h-full flex-col items-center justify-between',
          'max-w-440 mx-auto',
          'overflow-hidden',
        )}>
        <Tines className='h-3/5' />
        <Scene className='h-2/5 grow' />
        <Panel className='absolute bottom-0' />
      </div>
    </AppWrapper>
  )
}
