import { renderToStaticMarkup } from 'react-dom/server'

export function iconToFavicon(svg: React.ReactNode) {
  // Render the SVG component to a string
  const svgString = renderToStaticMarkup(svg)

  return {
    rel: 'icon',
    type: 'image/svg+xml',
    href: `data:image/svg+xml,${encodeURIComponent(svgString)}`,
  }
}
