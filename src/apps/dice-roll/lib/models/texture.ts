import { createTexture } from 'src/lib/graphics'
import { HALF_PI, TAU } from 'src/lib/math'

import { DICE_FONT_NAME } from '../common'

// Base size for the square texture
// and pre-computed fractions for automatic positioning
const TEXTURE_SIZE = 256
const HALF = TEXTURE_SIZE / 2
const THIRD = TEXTURE_SIZE / 3
const QUARTER = TEXTURE_SIZE / 4

/**
 * Create texture from text or texts
 *
 * Singular is centered and multiple are arranged in a triangle
 */
export function createTextTexture(text: string | string[]) {
  return createTexture((canvas, ctx) => {
    // Account for high-DPI screens
    const DPR = window.devicePixelRatio || 1
    canvas.width = canvas.height = TEXTURE_SIZE * DPR
    ctx.scale(DPR, DPR)

    // Shift everything to make drawing at 0,0 the center
    ctx.translate(HALF, HALF)

    // Set default text style
    ctx.font = `${THIRD}px '${DICE_FONT_NAME}'`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)'
    // 4 logical px: scales with DPR for a consistent outline at any density.
    ctx.lineWidth = 4

    const draw = (t: string, x = 0, y = 0) => {
      ctx.strokeText(t, x, y)
      ctx.fillText(t, x, y)
    }

    if (typeof text === 'string') {
      // Draw single text in the center
      draw(text)

      // Add a dot to '6.' and '9.'
      // to make them distinguishable
      if (text === '6' || text === '9') {
        draw('.', ctx.measureText(text).actualBoundingBoxRight * 1.3)
      }
    } else {
      // Draw multiple texts in a triangular pattern
      const radius = QUARTER // distance from center
      const step = TAU / 3

      text.forEach((t, i) => {
        const angle = i * step
        const x = radius * Math.cos(angle - HALF_PI)
        const y = radius * Math.sin(angle - HALF_PI)

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        draw(t)
        ctx.restore()
      })
    }
  })
}
