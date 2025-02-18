import { Link } from 'react-router'

import * as Tabs from '@radix-ui/react-tabs'

import { type AppID, apps } from 'app/apps'
import { PlaceholderIcon } from 'app/assets/svg'
import { AppWrapper } from 'app/components'

export function meta() {
  return [{ title: 'Home' }, { name: 'description', content: 'Home' }]
}

const tabs = [1, 2]

const homeRow: [AppID, AppID, AppID, AppID, AppID] = [
  'radio',
  'typing-test',
  '2048',
  'gallery',
  'camera',
]

export default function Launcher() {
  return (
    <AppWrapper className='flex h-full flex-col'>
      <Tabs.Root defaultValue='1' className='flex h-full flex-col items-center'>
        <div className='flex w-full grow justify-center py-6'>
          {tabs.map((tab) => (
            <Tabs.TabsContent
              key={tab}
              value={tab.toString()}
              className='grid w-full max-w-[1360px] grid-cols-5 grid-rows-4 place-items-center rounded-[2.5rem]'></Tabs.TabsContent>
          ))}
        </div>
        <Tabs.TabsList className='flex p-0.5'>
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab.toString()}
              className='cursor-pointer p-0.5'>
              <PlaceholderIcon fill='white' />
            </Tabs.Trigger>
          ))}
        </Tabs.TabsList>
      </Tabs.Root>
      <ul className='mx-auto flex w-full max-w-[850px] items-center justify-between p-2 sm:p-6'>
        {homeRow.map((app, i) => {
          const Icon = apps[app].Icon
          return (
            <li key={i} className='grid place-items-center'>
              <Link to={app} className='h-full w-full' prefetch='intent'>
                <Icon className='sm:size-19 size-17 p-2 sm:p-0' />
              </Link>
            </li>
          )
        })}
      </ul>
    </AppWrapper>
  )
}
