import { memo } from 'react'

import clsx from 'clsx'

import type { Props } from 'src/lib/types'

type ContainerProps = Props<'main', { id: string }>

export const Container = memo(({ className, ...props }: ContainerProps) => {
  return (
    <main
      className={clsx('h-dvh', 'init:text-balance text-pretty', className)}
      {...props}
    />
  )
})

Container.displayName = 'Container'
