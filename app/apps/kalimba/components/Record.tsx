import { useRef, useState } from 'react'

import clsx from 'clsx'

import { useRecorder } from '../lib'
import { DownloadLink, PlayButton, RecordButton, ResetButton } from './Buttons'

export function Record() {
  const { record, play, reset, recorder } = useRecorder()

  const [step, setStep] = useState<0 | 1 | 2>(0)

  function onRecord() {
    record()
    setStep(1)
  }

  async function onPlay() {
    const isPlaying = await play()
    if (isPlaying) return setStep(2)
    setStep(0) // if no recording/no playing, go back to step 0
  }

  function onReset() {
    reset()
    setStep(0)
  }

  return (
    <section
      className={clsx(
        'flex items-center justify-center gap-8',
        'p:flex-col-reverse l:flex-row',
      )}>
      {step == 0 && <RecordButton onClick={onRecord} />}
      {step == 1 && <PlayButton onClick={onPlay} />}
      {step == 2 && recorder.duration && (
        <ResetButton
          onClick={onReset}
          duration={`${recorder.duration + 0.09}s`}
        />
      )}
      {step == 2 && <Download url={recorder.url} />}
    </section>
  )
}

function Download({ url }: { url?: string }) {
  const id = useRef(Math.random().toString(36).slice(2, 6))

  return (
    <DownloadLink
      href={url}
      rel='noopener noreferrer'
      target='_blank'
      download={`Kalimba-${id.current}.webm`}
    />
  )
}
