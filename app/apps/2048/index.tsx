import clsx from 'clsx'

import { AppIcon, AppWraper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: '2048' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [favicon]
}

export const metadata: AppMetadata = {
  id: '2048',
  name: '2048',
  Icon: (props) => (
    <AppIcon fill='#E9C54C' {...props}>
      <path
        d='M29.542 59.56H15v-3.31c2.608-2.608 10.158-8.47 9.383-11.844-1.024-3.23-5.505-1.035-6.165.44l-3.202-2.447c3.301-5.093 13.516-4.506 13.806 2.053.044 5.185-5.11 8.364-8.115 11.223v.198h8.835v3.686ZM47.94 49.532c.021 5.978-1.704 10.495-7.675 10.533-6.361-.012-7.854-4.581-7.832-10.496-.022-5.927 1.594-10.527 7.832-10.538 6.022.011 7.654 4.618 7.675 10.5Zm-11.244.037c.038 2.342.225 6.871 3.494 6.904 3.235.037 3.504-4.796 3.513-6.941-.043-2.33-.163-6.834-3.476-6.857-3.366-.061-3.509 4.654-3.531 6.894Zm39.918-10.54c2.841.014 6.816 1.241 6.82 4.934-.004 2.919-1.217 3.576-3.547 4.849 2.565 1.548 4.178 2.704 4.207 5.747-.03 3.985-3.884 5.424-7.48 5.45-3.788-.026-7.524-1.378-7.582-5.507.06-2.98 1.806-4.667 3.701-5.62-2.164-1.328-3.178-2.013-3.124-4.947-.054-3.636 3.939-4.891 7.004-4.907Zm-3.512 15.115c-.014 1.894 1.566 2.581 3.47 2.565 1.835.016 3.224-.748 3.247-2.39.016-2.755-3.245-3.959-3.245-3.959s-3.486 1.204-3.472 3.784Zm3.48-11.66c-1.599-.014-3.05.346-3.057 1.892.007 1.8 3.025 3.034 3.025 3.034s2.778-1.218 2.82-3.161c-.064-1.418-1.27-1.78-2.787-1.766Zm-9.798 13.698h-2.59v3.362h-3.837v-3.36h-10.02v-3.712l9.777-12.951h4.08V52.78h2.59v3.402Zm-6.427-11.241-6.013 7.839h6.013v-7.84Z'
        fill='#fff'
        fillOpacity='.941'
      />
    </AppIcon>
  ),
  isDarkThemed: false,
}

const colors = {
  empty:
    'bg-[#BDAC98] shadow-[inset_0_1px_0_rgb(140,124,105),inset_0_6px_6px_rgb(182,163,139),inset_0_-1px_0_rgb(199,183,166)]',
  container: '',
  2: [
    'bg-[#EFE5DA] text-[#756452] text-6xl',
    'shadow-[0_1px_8px_rgba(72,61,59,0.3),inset_0_1px_0_rgb(245,239,233)]',
  ],
  4: [
    'bg-[#EBD8B6] text-[#756452] text-6xl',
    'shadow-[0_1px_8px_rgba(72,61,59,0.3),inset_0_1px_0_rgb(243,233,211)]',
  ],
  8: [
    'bg-[#F3B178] text-white text-6xl',
    'shadow-[0_1px_8px_rgba(72,61,59,0.3),inset_0_1px_0_rgb(245,194,149)]',
  ],
}

export default function _2048() {
  return (
    <AppWraper className='flex justify-center overflow-hidden bg-[#F9F7EF]'>
      <div
        className={
          'realtive mt-[178px] grid size-[590px] rounded-3xl bg-[#9c8b7c] opacity-100 shadow-[0_-1px_1px_rgba(255,255,255,0.2)]'
        }>
        <div className='left-0 grid size-[590px] grid-cols-4 grid-rows-4 gap-2.5 p-3'>
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                colors.empty,
                'size-[129px] place-self-center rounded-xl',
              )}
            />
          ))}
        </div>
        <div className='absolute grid size-[590px] grid-cols-4 grid-rows-4 gap-2.5 p-3'>
          {[
            { 2: 'col-start-2' },
            { 4: 'col-start-3 row-start-2' },
            { 8: 'col-start-2 row-start-2' },
            { 2: 'col-start-2 row-start-4' },
          ].map((data, i) => {
            const [[number, position]] = Object.entries(data)
            return (
              <div
                key={i}
                style={{ zIndex: i }}
                className={clsx(
                  // @ts-expect-error wlah ta s7i7
                  colors[number],
                  position,
                  'grid size-[134px] place-items-center place-self-center rounded-2xl font-black shadow-2xl',
                )}>
                {number}
              </div>
            )
          })}
        </div>
      </div>
    </AppWraper>
  )
}
