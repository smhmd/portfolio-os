import { Link } from 'react-router'

import * as Tabs from '@radix-ui/react-tabs'

import { type AppID, apps } from 'app/apps'
import { PlaceholderIcon } from 'app/assets/svg'
import { AppWraper } from 'app/components'
import { AppIcon } from 'app/components'

export function meta() {
  return [{ title: 'Home' }, { name: 'description', content: 'Home' }]
}

const tabs = [1, 2]

const homeRow: [AppID, AppID, AppID, AppID, AppID] = [
  'radio',
  'files',
  '2048',
  'gallery',
  'camera',
]

export default function Launcher() {
  return (
    <AppWraper className='flex h-full flex-col'>
      <Tabs.Root defaultValue='1' className='flex h-full flex-col items-center'>
        <div className='flex w-full grow items-center px-[185px]'>
          {tabs.map((tab) => (
            <Tabs.TabsContent
              key={tab}
              value={tab.toString()}
              className='grid w-full grid-cols-6 grid-rows-5 rounded-[2.5rem]'>
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  className='flex h-[149px] flex-col items-center gap-y-2 pt-5'
                  key={i}>
                  <AppIcon />
                  <span className='font-roboto text-[1.375rem]'>
                    Keep Notes
                  </span>
                </div>
              ))}
            </Tabs.TabsContent>
          ))}
        </div>
        <Tabs.TabsList className='flex gap-1'>
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab.toString()}
              className='cursor-pointer'>
              <PlaceholderIcon />
            </Tabs.Trigger>
          ))}
        </Tabs.TabsList>
      </Tabs.Root>
      <ul className='gap-26 py-5.5 flex justify-center'>
        {homeRow.map((app, i) => {
          const Icon = apps[app].Icon
          return (
            <li key={i} className='grid size-20 place-items-center'>
              <Link to={app} className='h-full w-full' prefetch='intent'>
                <Icon />
              </Link>
            </li>
          )
        })}
      </ul>
    </AppWraper>
  )
}
