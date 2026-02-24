import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { Stage, UI } from './components'
import { DiceProvider } from './contexts'
import { DICE_FONT_NAME } from './lib'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(
    <AppIcon fill='transparent' padding={14} wip={false} />,
  )
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${DICE_FONT_NAME}:wght@700&display=swap&text=D0123456789.`,
    },
  ]
}

export default function App() {
  return (
    <AppWrapper className='relative h-screen w-full'>
      <DiceProvider>
        <Stage />
        <UI />
      </DiceProvider>
    </AppWrapper>
  )
}
