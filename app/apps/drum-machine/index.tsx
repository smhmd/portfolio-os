import clsx from 'clsx'

import { AppIcon, AppWrapper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

import { Button, Frame, Parameter, Screen, Speaker, Volume } from './components'
import styles from './styles.css?url'

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
    { rel: 'stylesheet', href: styles },
  ]
}

export default function App() {
  return (
    <AppWrapper
      className={clsx('flex items-center justify-center bg-white')}
      isDark>
      <Frame>
        <Speaker />
        <Volume />
        <Screen />
        <Parameter variant='blue' />
        <Parameter variant='brown' />
        <Parameter variant='gray' />
        <Parameter variant='orange' />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button />
        <Button variant={{ color: 'black', pos: 'right' }} />
        <Button variant={{ color: 'black' }} />
        <Button variant={{ color: 'black', pos: 'left' }} />
        <Button variant={{ color: 'black', pos: 'right' }} />
        <Button variant={{ color: 'black', pos: 'left' }} />
        <Button variant={{ color: 'black', pos: 'right' }} />
        <Button variant={{ color: 'black' }} />
        <Button variant={{ color: 'black', pos: 'left' }} />
        <Button variant={{ color: 'black', pos: 'right' }} />
        <Button variant={{ color: 'black', pos: 'left' }} />
        <Button />
        <Button />
        <Button />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button variant={{ size: 'lg' }} />
        <Button />
        <Button />
        <Button />
      </Frame>
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
