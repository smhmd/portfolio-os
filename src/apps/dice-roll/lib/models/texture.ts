import { CanvasTexture, SRGBColorSpace } from 'three'

import { HALF_PI, TAU } from 'src/lib'

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
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  // Account for high-DPI screens
  const DPR = window.devicePixelRatio || 1
  canvas.width = canvas.height = TEXTURE_SIZE * DPR
  canvas.style.width = canvas.style.height = `${TEXTURE_SIZE}px`
  context.scale(DPR, DPR)

  // Shift everything to make drawing at 0,0 the center
  context.translate(HALF, HALF)

  // Set default text style
  context.font = `${THIRD}px "${DICE_FONT_NAME}"`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'white'
  context.strokeStyle = 'rgba(0, 0, 0, 0.35)'
  context.lineWidth = 4 / DPR

  if (typeof text === 'string') {
    // Draw single text in the center
    context.strokeText(text, 0, 0)
    context.fillText(text, 0, 0)

    // Add a dot to '6.' and '9.'
    // to make them distinguishable
    if (text === '6' || text === '9') {
      const metrics = context.measureText(text)
      const dotX = metrics.actualBoundingBoxRight * 1.3
      context.strokeText('.', dotX, 0)
      context.fillText('.', dotX, 0)
    }
  } else {
    // Draw multiple texts in a triangular pattern
    const radius = QUARTER // distance from center
    const step = TAU / 3

    text.forEach((t, i) => {
      const angle = i * step
      const x = radius * Math.cos(angle - HALF_PI)
      const y = radius * Math.sin(angle - HALF_PI)

      context.save()

      context.translate(x, y)
      context.rotate(angle)
      context.strokeText(t, 0, 0)
      context.fillText(t, 0, 0)

      context.restore()
    })
  }

  // Convert the canvas to a texture
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true // Update in GPU

  return texture
}
