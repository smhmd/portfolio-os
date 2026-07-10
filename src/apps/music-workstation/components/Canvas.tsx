import { useRef } from 'react'

import { Application, extend } from '@pixi/react'
import { Container, Graphics } from 'pixi.js'

extend({ Container, Graphics })

/**
 * A transparent Pixi canvas that fills its parent. Screens that need graphics
 * wrap their scene in one of these; the HTML overlay sits as a sibling above it.
 */
export function Canvas({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className='absolute inset-0'>
      <Application
        resizeTo={ref}
        backgroundAlpha={0}
        antialias
        autoDensity
        resolution={globalThis.devicePixelRatio ?? 1}>
        {children}
      </Application>
    </div>
  )
}
