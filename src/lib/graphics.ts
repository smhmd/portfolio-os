import { CanvasTexture } from 'three'

import { isServer } from './env'

export function svgToURL(svgString: string) {
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`
}

export function createTexture(
  render: (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) => void | Promise<void>,
): CanvasTexture {
  if (isServer) return new CanvasTexture()

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const texture = new CanvasTexture(canvas)

  // Support async renderers (e.g. ones that await image decodes):
  // re-flag the texture for upload once drawing has actually finished.
  Promise.resolve(render(canvas, ctx))
    .then(() => {
      texture.needsUpdate = true
    })
    .catch(console.error)

  return texture
}
