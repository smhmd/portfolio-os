import { renderToStaticMarkup } from 'react-dom/server'

import { DOMAIN } from './env'
import { svgToURL } from './graphics'
import { type AppMetadata } from './types'

export function iconToFavicon(svg: React.ReactNode) {
  // Render the SVG component to a string
  const svgString = renderToStaticMarkup(svg)

  return {
    rel: 'icon',
    type: 'image/svg+xml',
    href: svgToURL(svgString),
  }
}

export function generateMeta(metadata: AppMetadata) {
  const imageUrl = `${DOMAIN}/og/${metadata.id}.avif`

  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },

    { property: 'og:site_name', content: "Simohamed's Portfolio" },
    { property: 'og:title', content: metadata.name },
    { property: 'og:description', content: metadata.description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `${DOMAIN}/${metadata.id}` },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.name },
    { name: 'twitter:description', content: metadata.description },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:site', content: '@_smhmd' },
    { name: 'twitter:creator', content: '@_smhmd' },
  ]
}
