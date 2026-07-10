import clsx from 'clsx'

import { Container } from 'src/components'
import { generateMeta, iconToFavicon } from 'src/lib/server'

import { StickyNote, Timer, TypingArea, WavyText } from './components'
import { useTypingTest } from './lib'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return generateMeta(metadata)
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={14} />)
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap`,
    },
  ]
}

export default function App() {
  const {
    typed,
    isIdle,
    isDone,
    isTyping,
    grade,
    wpm,
    accuracy,
    errors,
    handleInput,
    handleReset,
  } = useTypingTest()

  return (
    <Container
      id={metadata.id}
      className={clsx(
        'relative isolate',
        'flex flex-col items-center justify-center gap-y-6 p-4',
        'bg-[#FCFDF5] text-[#465862]',
      )}>
      <Background />
      <h1
        className={clsx(
          'text-3xl font-black uppercase text-[whitesmoke]',
          'z-2 -mb-10 px-4 py-2',
          'rotate-6',
          'bg-cover bg-center bg-no-repeat',
          'bg-[url(/images/tape.svg)]',
        )}>
        {metadata.name}
      </h1>

      <StickyNote>
        <TypingArea
          isDone={isDone}
          onInput={handleInput}
          typed={typed}
          grade={grade}
        />
      </StickyNote>

      <footer>
        {isTyping && <Timer />}
        {isIdle && <WavyText value='Start typing to begin!' />}
        {isDone && <WavyText value={`See your results!`} />}
      </footer>
    </Container>
  )
}

function Background() {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-0',
        'bg-size-[40px_40px] opacity-7 bg-center',
        'bg-[linear-gradient(90deg,#000_1px,#0000_0),linear-gradient(#000_1px,#0000_0)]',
        'mask-b-from-50% mask-radial-[50%_50%] mask-radial-from-80%',
      )}
    />
  )
}
