import {
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three'

import { DEFAULT_LABELS, DICE_FONT_NAME } from '../common'
import { createTextTexture } from './texture'

const texture = new TextureLoader().load('/images/ice.avif')
texture.colorSpace = SRGBColorSpace
texture.wrapS = texture.wrapT = RepeatWrapping

// This module is only imported client-side (lazy-loaded components),
// so we can wait for the font at the top level. Creating text textures
// before the font is ready would bake in the fallback font.
await document.fonts.load(`1pt '${DICE_FONT_NAME}'`)

const createLabelMaterial = (text: string | string[]) =>
  new MeshStandardMaterial({
    map: createTextTexture(text),
    transparent: true,
  })

const defaultLabelMaterials = DEFAULT_LABELS.map(createLabelMaterial)

type Options = {
  background: string
  labels?: string[] | string[][]
}

/**
 * Create materials to apply to our dice
 *
 * Returns an array of materials,
 * the first of which is the underlying color,
 * and the rest are the text per face materials.
 */
export function createMaterials({ background, labels }: Options) {
  const backgroundMaterial = new MeshStandardMaterial({
    color: background,
    map: texture,
    metalness: 0.1,
    flatShading: true, // preserve sharp edges
  })

  const labelMaterials = labels
    ? labels.map(createLabelMaterial)
    : defaultLabelMaterials

  return [backgroundMaterial, ...labelMaterials]
}
