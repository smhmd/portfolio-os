import { AppIconWrapper } from 'app/components'

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='#ca5057' {...props}>
      <path
        d='M27.833 71h5.833m-5.833-7h5.833m-5.833-7h5.833m-5.833-7h5.833m7 21H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m-5.834-7H46.5m7 42h5.833m7 0h5.833M53.5 64h5.833m7 0h5.833M53.5 57h5.833m7 0h5.833m-5.833-7h5.833m-5.833-7h5.833'
        stroke='#E6E6E6'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </AppIconWrapper>
  )
}
