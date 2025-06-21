/**
 * For accessibility-reasons,
 * imported SVGs require either aria-label or aria-labelledby
 * unless you pass role='presentation' or aria-hidden='true'
 */
type SVGPropsOverrides =
  | {
      'aria-label': string
    }
  | {
      'aria-labelledby': string
    }
  | {
      role: 'presentation'
    }
  | {
      'aria-hidden': true | 'true'
    }

declare module '*.svg?react' {
  import * as React from 'react'

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<'svg'> & {
      title?: string
      titleId?: string
      desc?: string
      descId?: string
    } & SVGPropsOverrides
  >
  export default ReactComponent
}
