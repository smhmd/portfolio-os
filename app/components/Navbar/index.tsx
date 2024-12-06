import { useLocation, useNavigate } from 'react-router'

import clsx from 'clsx'

import { Back, Circle, Square } from 'app/assets/svg'

export function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname !== '/'

  return (
    <nav
      className={clsx(
        'fixed bottom-0 flex w-full justify-center gap-6',
        isHome && 'bg-black/40',
      )}>
      <NavButton aria-label='Recent'>
        <Square className='fill-none stroke-white stroke-2' />
      </NavButton>
      <NavButton
        aria-label='Home'
        onClick={() => {
          navigate('/')
        }}>
        <Circle className='fill-white' />
      </NavButton>
      <NavButton
        aria-label='Back'
        onClick={() => {
          navigate(-1)
        }}>
        <Back className='fill-white' />
      </NavButton>
    </nav>
  )
}

function NavButton(props: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className='grid w-80 cursor-pointer place-items-center py-6'
    />
  )
}
