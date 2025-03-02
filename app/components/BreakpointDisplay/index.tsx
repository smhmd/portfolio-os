import { SHOW_TAILWIND_BREAKPOINTS } from 'app/lib'

export function BreakpointDisplay() {
  if (import.meta.env.DEV) {
    if (SHOW_TAILWIND_BREAKPOINTS)
      return (
        <div className='text-xxs fixed bottom-0 right-0 z-50 flex items-center rounded px-1 text-pink-600 *:hidden'>
          <span className='inline! sm:hidden!'>default</span>
          <span className='sm:inline md:hidden'>sm</span>
          <span className='md:inline lg:hidden'>md</span>
          <span className='lg:inline xl:hidden'>lg</span>
          <span className='xl:inline 2xl:hidden'>xl</span>
          <span className='3xl:hidden 2xl:inline'>2xl</span>
          <span className='3xl:inline'>3xl</span>
        </div>
      )
  }
  return null
}
