import { SHOW_TAILWIND_BREAKPOINTS } from 'src/lib'

export function BreakpointDisplay() {
  if (import.meta.env.DEV) {
    if (SHOW_TAILWIND_BREAKPOINTS)
      return (
        <div className='fixed bottom-0 right-0 z-50 flex'>
          <div className='text-xxs flex items-center bg-white px-1 text-black shadow-[inset_0_0_0_1px_black] *:hidden'>
            <span className='inline! sm:hidden!'>default</span>
            <span className='sm:inline md:hidden'>sm</span>
            <span className='md:inline lg:hidden'>md</span>
            <span className='lg:inline xl:hidden'>lg</span>
            <span className='xl:inline 2xl:hidden'>xl</span>
            <span className='3xl:hidden 2xl:inline'>2xl</span>
            <span className='3xl:inline'>3xl</span>
          </div>
          <div className='text-xxs vertical-rl z-50 flex items-center bg-black px-1 text-white *:hidden'>
            <span className='inline! vsm:hidden!'>default</span>
            <span className='vsm:inline vmd:hidden'>sm</span>
            <span className='vmd:inline vlg:hidden'>md</span>
            <span className='vlg:inline vxl:hidden'>lg</span>
            <span className='vxl:inline v2xl:hidden'>xl</span>
            <span className='v2xl:inline'>2xl</span>
          </div>
        </div>
      )
  }
  return null
}
