import clsx from 'clsx'
import * as motion from 'motion/react-client'
import type { LoaderFunction } from 'react-router'

import { AppWrapper } from 'app/components'
import { getCookie, iconToFavicon } from 'app/utils'

import {
  Halo,
  InstrumentProvider,
  OptionsProvider,
  RecordIcon,
  Settings,
  Tines,
} from './components'
import { Scene } from './components/Scene'
import { colors, useOptions } from './lib'
import { AppIcon, metadata } from './metadata'

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
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('Cookie') ?? ''
  const options = getCookie('kalimba.options', cookie)

  return options
}

export default function App() {
  return (
    <OptionsProvider>
      <InstrumentProvider>
        <Content />
      </InstrumentProvider>
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
        colors[options.color],
      )}>
      <div
        className={clsx(
          'relative flex h-full flex-col items-center justify-between',
          'mx-auto max-w-[110rem]',
          'overflow-hidden',
        )}>
        <Tines className='h-3/5' />
        <Scene className='h-2/5 grow' />
        <motion.footer
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{
            delay: 0.2,
            ease: 'easeOut',
            stiffness: 200,
            damping: 25,
            bounce: 0,
          }}
          className={clsx(
            'absolute bottom-0',
            'flex w-full justify-between',
            'xl:px-18 xl:pb-18 px-8 pb-16',
          )}>
          <div>
            <button className='group relative cursor-pointer outline-none'>
              <Halo className='group-active:translate-y-[4px]' />
              <RecordIcon className='size-12 xl:size-24' />
            </button>
          </div>
          <Settings />
        </motion.footer>
      </div>
    </AppWrapper>
  )
}
