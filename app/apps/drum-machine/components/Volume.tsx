import { useDial } from '../lib'
import { Base } from './Base'

export function Volume() {
  const { ref, drag, rotation } = useDial({})
  return (
    <Base className='col-span-4 row-span-2 *:grid-cols-2'>
      <div
        data-name='volume-knob'
        className='relative aspect-square cursor-grab active:cursor-grabbing'
        ref={ref}
        onMouseDown={drag}
        onTouchStart={drag}
        style={{ touchAction: 'none' }}>
        <div className='bg-volume-base absolute inset-2.5 rounded-full'>
          <div className='bg-volume-body-border absolute inset-0.5 rounded-full p-px'>
            <div className='bg-volume-body size-full rounded-full'>
              <div className='bg-volume-top-border absolute inset-1.5 rounded-full p-px'>
                <div className='bg-volume-top size-full rounded-full'>
                  <div
                    className='absolute inset-0 flex justify-center p-1.5'
                    style={{ transform: `rotate(${rotation}deg)` }}>
                    <div
                      className='bg-volume-indicator absolute -ml-0.5 size-1.5 rounded-full'
                      style={{ transform: `rotate(${-rotation}deg)` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-name='volume-mute' className='relative aspect-square size-full'>
        <div className='bg-bump-mute blur-px absolute inset-2.5 rounded-[11px]' />
        <div className='z-1 absolute inset-4'>
          <div className='bg-mute size-full rounded-md' />
        </div>
      </div>
    </Base>
  )
}
