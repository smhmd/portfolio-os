import {
  MeshStandardMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from 'three'

import { clientOnly, isServer } from 'app/lib'

import { DEFAULT_LABELS, DICE_FONT_NAME } from '../common'
import { createTextTexture } from './texture'

/** Ice texture that adds a gem-like look to the dice */
const iceTexture = clientOnly(() => {
  const loader = new TextureLoader()
  const texture = loader.load('/textures/Ice_1K.jpg')
  texture.colorSpace = SRGBColorSpace
  texture.wrapS = texture.wrapT = RepeatWrapping
  return texture
})

/** Default 1,2,3..20 text materials for most dice */
const defaultLabelMaterials = await clientOnly(async () => {
  // make sure the font is already loaded
  await document.fonts.load(`1pt ${DICE_FONT_NAME}`)

  return DEFAULT_LABELS.map(
    (text) =>
      new MeshStandardMaterial({
        map: createTextTexture(text),
        transparent: true,
      }),
  )
})

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
  if (isServer) return [] // Skip material creation server-side

  // colored background for the dice (gem-like)
  const backgroundMaterial = new MeshStandardMaterial({
    color: background,
    map: iceTexture,
    metalness: 1.4,
    flatShading: true, // preserve sharp edges
  })

  // Use default label materials
  let labelMaterials = defaultLabelMaterials

  // If labels provided, override the default materials
  if (labels) {
    labelMaterials = labels.map(
      (text) =>
        new MeshStandardMaterial({
          map: createTextTexture(text),
          transparent: true,
        }),
    )
  }

  return [backgroundMaterial, ...labelMaterials]
}
