import { WavyText } from './WavyText'

interface ResultsViewProps {
  wpm: number
  accuracy: number
  errors: number
  onReset: () => void
}

export function Result({ wpm, accuracy, errors, onReset }: ResultsViewProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-y-4'>
      <div className='flex flex-col items-center justify-center'>
        <WavyText value={`WPM: ${Math.round(wpm)}`} />
        <WavyText value={`Accuracy: ${Math.round(accuracy)}%`} />
        <WavyText value={`Mistakes: ${errors}`} />
      </div>
      <button
        onClick={onReset}
        className='cursor-pointer rounded bg-gray-900 px-4 py-2 text-xs text-white hover:bg-gray-800'>
        Try Again
      </button>
    </div>
  )
}
