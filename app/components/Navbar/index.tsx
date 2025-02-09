import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import clsx from 'clsx'

import { Back, Circle, Square } from 'app/assets/svg'
import { useCurrentApp } from 'app/contexts'

type Props = React.ComponentProps<'nav'>

export function NavBar({ className, ...props }: Props) {
  const navigate = useNavigate()

  const currentApp = useCurrentApp()
  const isInsideApp = currentApp !== null

  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    if (!isInsideApp && isHidden) return

    const timerId = setTimeout(() => setIsHidden(true), 2500) // Auto-hide after delay.
    return () => clearTimeout(timerId)
    // Hide the nav when we navigate between apps and automatically hide the nav after a delay.
  }, [currentApp, isHidden])

  const show = () => {
    setIsHidden(false)
  }

  return (
    <div className='fixed inset-x-0 bottom-0'>
      {/* Invisible trigger area. Unhides the nav bar on hover or touch (mobile.) */}
      <div onTouchStart={show} className='-z-1 peer absolute inset-0' />
      <nav
        className={clsx(
          'flex justify-center gap-5',
          'transition-transform duration-300',
          // We visually unhide the nav, if it has focus, is hovered, or the trigger area underneath it is hovered.
          'focus-within:translate-y-0 focus-within:delay-0 hover:translate-y-0 hover:delay-0 peer-hover:translate-y-0 peer-hover:delay-0',
          {
            'bg-black/25': isInsideApp,
            // We add a delay to the translate transform that matches the delay for the touchscreen impl.
            'delay-2500 translate-y-full': isHidden && isInsideApp,
          },
          className,
        )}
        {...props}>
        <NavButton aria-label='Recent'>
          <Square className='size-5 fill-none stroke-white stroke-2' />
        </NavButton>
        <NavButton
          aria-label='Home'
          onClick={() => {
            navigate('/')
          }}>
          <Circle className='size-5 fill-white' />
        </NavButton>
        <NavButton
          aria-label='Back'
          onClick={() => {
            navigate(-1)
          }}>
          <Back className='size-5 fill-white' />
        </NavButton>
      </nav>
    </div>
  )
}

function NavButton(props: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className='grid w-64 cursor-pointer place-items-center py-5'
    />
  )
}
