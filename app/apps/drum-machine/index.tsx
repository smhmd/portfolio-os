import clsx from 'clsx'

import { PixelPause } from 'app/assets/svg'
import { AppIcon, AppWrapper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

import { STEPS } from './lib'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: '2048' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [
    favicon,
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap',
    },
  ]
}

const drums = ['kick', 'snare', 'hi-hat']

export default function App() {
  return (
    <AppWrapper
      className={clsx(
        'bg-[#333] text-[#e6e6e6]',
        'font-silkscreen flex flex-col items-center justify-center gap-y-4',
      )}>
      <div className='flex flex-col gap-4'>
        {drums.map((drum, i) => (
          <div key={i} className='-ml-16 flex items-center gap-1.5'>
            <span className='w-16 text-right'>{drum}</span>
            {Array.from({ length: STEPS }).map((_, i) => {
              const measure = i % 4 ? null : i / 4 + 1
              return (
                <button
                  onClick={() => {
                    console.log(i + 1, drum)
                  }}
                  key={i}
                  className={clsx(
                    'flex h-12 w-8 items-center justify-center rounded-[1px] bg-[#404040]',
                    measure === 1 &&
                      'ring ring-[#CACACA] ring-offset-2 ring-offset-[#333]',
                  )}>
                  {measure}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className='flex flex-wrap gap-2 *:rounded *:border-2 *:border-[#494949] *:p-1'>
        <button>
          <PixelPause />
        </button>
        <label className='flex grow flex-col items-start justify-center'>
          <span>120BPM</span>
          <input
            type='range'
            min='72'
            max='140'
            defaultValue='120'
            className={clsx(
              'h-1 w-full appearance-none rounded-lg bg-[#CACACA] accent-white outline-none',
              'thumb:h-50 thumb:w-50 thumb:cursor-pointer thumb:appearance-none thumb:rounded-full thumb:bg-[#CACACA]',
            )}
          />
        </label>
        <select>
          <option>4/4</option>
          <option>3/4</option>
          <option>6/8</option>
        </select>
        <label className='flex grow flex-col items-start justify-center'>
          <span className='text-xs'>Volume</span>
          <div className='flex w-full items-center justify-between'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M12 2h-2v2H8v2H6v2H2v8h4v2h2v2h2v2h2zM8 18v-2H6v-2H4v-4h2V8h2V6h2v12zm14-7h-8v2h8z'
              />
            </svg>
            <input type='range' min='72' max='140' defaultValue='120' />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'>
              <path
                fill='currentColor'
                d='M10 2h2v20h-2v-2H8v-2h2V6H8V4h2zM6 8V6h2v2zm0 8H2V8h4v2H4v4h2zm0 0v2h2v-2zm13-5h3v2h-3v3h-2v-3h-3v-2h3V8h2z'
              />
            </svg>
          </div>
        </label>
        <button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M4 2h14v2H4v16h2v-6h12v6h2V6h2v16H2V2zm4 18h8v-4H8zM20 6h-2V4h2zM6 6h9v4H6z'
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M11 5V3h2v2h2v2h2v2h-2V7h-2v10h-2V7H9v2H7V7h2V5zM3 15v6h18v-6h-2v4H5v-4z'
            />
          </svg>
        </button>
      </div>
    </AppWrapper>
  )
}

export const metadata: AppMetadata = {
  id: 'drum-machine',
  name: 'Drum Machine',
  Icon: (props) => (
    <AppIcon fill='#ca5057' {...props}>
      <path
        d='M27.833 71h5.833m-5.833-7h5.833m-5.833-7h5.833m-5.833-7h5.833m7 21H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m7 42h5.833m7 0h5.833M53.5 64h5.833m7 0h5.833M53.5 57h5.833m7 0h5.833m-5.833-7h5.833m-5.833-7h5.833'
        stroke='#E6E6E6'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </AppIcon>
  ),
}
