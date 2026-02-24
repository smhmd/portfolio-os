import { useDice } from '../contexts'
import { BACKGROUNDS, type Variant } from '../lib'

export function UI() {
  const { addDice } = useDice()

  return (
    <section className='font-unifraktur fixed inset-x-0 bottom-0 flex items-center justify-center gap-x-4 pb-8'>
      <div className='flex flex-wrap justify-center divide-x divide-black'>
        {Object.entries(BACKGROUNDS).map(([d, c]) => (
          <button
            onClick={() => {
              addDice(Number(d) as Variant)
            }}
            className='text-shadow-lg relative cursor-pointer bg-cover bg-center bg-no-repeat p-4 text-center bg-blend-overlay'
            key={d}
            style={{
              background: `url('/textures/Ice_1K.jpg'), color-mix(in srgb, ${c} 90%, #222)`,
            }}>
            D{d}
          </button>
        ))}
      </div>
    </section>
  )
}
