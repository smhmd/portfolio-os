import { memo, useEffect, useRef, useState } from 'react'

type TimerProps = {
  enabled?: boolean
  initialSeconds?: number
}
/**
 * Timer component that counts up every second and displays in the format "M:SS".
 * Can be paused and resumed from outside the component by toggling the `enabled` prop.
 */
export const Timer = memo(
  ({ enabled = true, initialSeconds = 0 }: TimerProps) => {
    // State for total seconds
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds)

    // Store interval id in a ref to prevent re-creating it every render
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
      if (!enabled) return

      // Start a new interval when enabled
      intervalIdRef.current = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1)
      }, 1000)

      // Cleanup the interval when the component unmounts or when disabled
      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
        }
      }
    }, [enabled]) // Effect depends only on `enabled`

    // Derive minutes and seconds from totalSeconds
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    // Format the timer as "M:SS" (e.g., 0:05, 1:30, etc.)
    const time = `${minutes}:${seconds.toString().padStart(2, '0')}`

    return <div>{time}</div>
  },
)

Timer.displayName = 'Timer'
