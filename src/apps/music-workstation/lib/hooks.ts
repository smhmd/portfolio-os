import { useCallback, useEffect, useRef, useState } from 'react'

import { PI } from 'src/lib'

type UseDialProps = {
  initialValue?: number
  min?: number
  max?: number
  onChange?(value: number): void
}

// Calculate angle from center to pointer position
const calculateAngle = (
  event: MouseEvent | TouchEvent,
  element: HTMLElement,
): number => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  let clientX: number, clientY: number

  if ('touches' in event && event.touches.length > 0) {
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else if ('clientX' in event) {
    clientX = event.clientX
    clientY = event.clientY
  } else {
    return 0 // Fallback
  }

  const x = clientX - centerX
  const y = clientY - centerY

  return (Math.atan2(y, x) * (180 / PI) + 360) % 360
}

export function useDial({
  initialValue = 0,
  min = 0,
  max = 100,
  onChange,
}: UseDialProps) {
  const [rotation, setRotation] = useState<number>(
    (initialValue / (max - min)) * 360,
  )
  const [value, setValue] = useState<number>(initialValue)
  const dialRef = useRef<HTMLDivElement>(null)
  const prevAngleRef = useRef<number | null>(null)

  const updateRotation = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!dialRef.current || prevAngleRef.current === null) return

      const currentAngle = calculateAngle(e, dialRef.current)
      let deltaAngle = currentAngle - prevAngleRef.current

      // Handle crossing the 0/360 boundary
      if (deltaAngle > 180) deltaAngle -= 360
      if (deltaAngle < -180) deltaAngle += 360

      setRotation((prev) => {
        const newRotation = prev + deltaAngle

        // Normalize value in the range [min, max]
        const range = max - min
        const normalizedPercentage = (((newRotation % 360) + 360) % 360) / 360
        const newValue = Math.round(min + normalizedPercentage * range)

        if (newValue !== value) {
          setValue(newValue)
          if (onChange) onChange(newValue)
        }

        return newRotation
      })

      prevAngleRef.current = currentAngle
    },
    [min, max, onChange, value],
  )

  const startDragging = useCallback(
    (event: React.MouseEvent | React.TouchEvent): void => {
      event.preventDefault()
      if (!dialRef.current) return

      // Get initial angle
      prevAngleRef.current = calculateAngle(
        event.nativeEvent as MouseEvent | TouchEvent,
        dialRef.current,
      )

      const handleMouseMove = (e: MouseEvent) => updateRotation(e)
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        updateRotation(e)
      }
      const endDragging = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', endDragging)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', endDragging)
        prevAngleRef.current = null
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', endDragging)
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      })
      document.addEventListener('touchend', endDragging)
    },
    [updateRotation],
  )

  useEffect(() => {
    setRotation((initialValue / (max - min)) * 360)
  }, [initialValue, min, max])

  return {
    ref: dialRef,
    drag: startDragging,
    value,
    rotation,
  }
}
