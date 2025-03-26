import { useCallback, useRef, useState } from 'react'

import { useMachine, useSelector } from '@xstate/react'
import clsx from 'clsx'

import { Close, FilePresent, Upload } from 'app/assets/svg'
import { AppIcon, AppWrapper } from 'app/components'
import { type AppMetadata } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { AdvancedOptions, MagnetLink } from './components'
import { compareState, machine, type Options } from './lib'
import styles from './styles.css?url'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: '2048' }]
}

export function links() {
  const favicon = iconToFavicon(
    <metadata.Icon fill='transparent' viewBox='24 24 52 52' />,
  )
  return [favicon, { rel: 'stylesheet', href: styles }]
}

function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const dragClasses = {
  on: 'scale-102 animate-pulse-glow border-purple-400 bg-purple-400/10',
  off: 'border-purple-100/40 hover:border-purple-400',
  error: 'scale-102 animate-pulse-glow border-red-400 bg-red-400/10 ',
}

export default function App() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [_, send, actor] = useMachine(machine)
  const { torrentObject, magnetURI, options } = useSelector(
    actor,
    ({ context }) => context,
    compareState,
  )

  const [dragStatus, setDragStatus] = useState<keyof typeof dragClasses>('off')

  const handleOptionChange = useCallback(
    (payload: { option: keyof Options; value: boolean }) => {
      send({ type: 'option.set', payload })
    },
    [],
  )

  const handleSelectedFilesChange = useCallback((payload: Set<number>) => {
    send({ type: 'selectedFiles.set', payload })
  }, [])

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile?.name.endsWith('.torrent')) {
        const arrayBuffer = await fileToArrayBuffer(selectedFile)
        send({ type: 'torrent.add', payload: arrayBuffer })
      }
    },
    [],
  )

  const handleReset = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      send({ type: 'reset' })
    }
  }, [])

  return (
    <AppWrapper
      isFullscreen
      className='flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 px-4 text-white selection:bg-purple-950/40'>
      <div className='flex w-full max-w-2xl flex-col gap-8'>
        <header className='flex flex-col gap-4 text-center'>
          <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
            Torr
            <metadata.Icon
              viewBox='24 24 52 52'
              fill='transparent'
              className='inline size-5 md:size-7'
            />
            nt Magnetizer
          </h1>
          <p className='text-lg text-purple-200'>
            <span>
              Transform your torrent files into magnetic
              <span className='whitespace-nowrap'> energy ⚡</span>
            </span>
          </p>
        </header>

        <section className='rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl'>
          <div
            className={clsx(
              'group relative rounded-xl border-2 border-dashed transition duration-500',
              dragClasses[dragStatus],
              torrentObject && 'bg-purple-900/20',
            )}
            onDragEnter={(e) => {
              const files = [...e.dataTransfer.items]

              if (files.length === 1) {
                const { kind, type } = files[0]
                if (kind === 'file' && type === 'application/x-bittorrent') {
                  return setDragStatus('on')
                }
              }
              setDragStatus('error')
            }}
            onDragLeave={() => {
              setDragStatus('off')
            }}
            onDrop={() => {
              setDragStatus('off')
            }}>
            <input
              ref={fileInputRef}
              type='file'
              accept='.torrent'
              onChange={handleFileUpload}
              className='absolute inset-0 cursor-pointer opacity-0'
            />

            <div className='pointer-events-none p-8 text-center text-purple-300'>
              {!torrentObject ? (
                <div className='animate-fade-in'>
                  <Upload className='mx-auto mb-4 size-16 fill-current transition-transform duration-300 group-hover:scale-110' />
                  <p className='mb-2 text-lg font-medium'>
                    Drop your torrent file here
                  </p>
                  <p className='text-sm'>or click to browse your files</p>
                </div>
              ) : (
                <div className='animate-fade-in flex gap-x-4'>
                  <div className='flex min-w-0 flex-1 items-center gap-x-3'>
                    <FilePresent className='size-8 flex-shrink-0 fill-current' />
                    <span className='truncate'>{torrentObject.info.name}</span>
                  </div>
                  <button
                    onClick={handleReset}
                    className={clsx(
                      'pointer-events-auto cursor-pointer outline-none',
                      'hover:rotate-90 hover:bg-white/10 focus-visible:rotate-90 focus-visible:bg-white/10',
                      'flex-shrink-0 rounded-full p-2 transition-all duration-300',
                    )}
                    title='Remove file'>
                    <Close className='size-5 fill-current' />
                  </button>
                </div>
              )}
            </div>
          </div>

          {torrentObject && (
            <AdvancedOptions
              torrentObject={torrentObject}
              options={options}
              onOptionChange={handleOptionChange}
              onSelectedFilesChange={handleSelectedFilesChange}
            />
          )}
          {magnetURI && <MagnetLink link={magnetURI} />}
        </section>

        <footer className='text-center text-sm text-purple-300'>
          <p>Powered by quantum entanglement and digital magic ✨</p>
        </footer>
      </div>
    </AppWrapper>
  )
}

export const metadata: AppMetadata = {
  id: 'magnetize',
  name: 'Magnetize',
  Icon: (props) => (
    <AppIcon fill='#62348B' {...props}>
      <g clipPath='url(#a)'>
        <path
          fill='#CCD6DD'
          d='m52.122 36.017-5.567-6.747a1.459 1.459 0 0 0-2.053-.197l-4.876 4.023 7.422 8.996 4.876-4.023c.623-.512.71-1.431.198-2.052Z'
        />
        <path
          fill='#BE1931'
          d='m66.673 60.142-8.996-7.422s-3.46 4.524-7.23 8.886c-2.87 3.32-8.802 3.2-12.143-.141-3.34-3.341-3.46-9.274-.141-12.142 4.362-3.772 8.886-7.231 8.886-7.231l-7.422-8.996s-7.398 5.674-9.552 7.843c-7.898 7.956-7.925 20.826.002 28.753s20.797 7.898 28.753.002c2.17-2.154 7.843-9.553 7.843-9.553Z'
        />
        <path
          fill='#CCD6DD'
          d='m63.752 47.647 6.747 5.567c.621.513.71 1.431.197 2.053l-4.023 4.876-8.996-7.422 4.023-4.876a1.46 1.46 0 0 1 2.052-.198Z'
        />
        <path
          fill='#FFAC33'
          d='m58.258 30.1-2.538-2.59 2.796-2.737c.009-.008.006-.021.013-.03a.204.204 0 0 0 .04-.09c.01-.035.018-.064.014-.1-.002-.01.007-.02.005-.032-.005-.025-.029-.035-.04-.055-.012-.023-.007-.05-.026-.07-.009-.008-.022-.005-.032-.012-.029-.024-.06-.03-.097-.041-.031-.009-.059-.017-.09-.014-.012.001-.024-.01-.035-.006l-7.419 1.816a.274.274 0 0 0-.193.186.274.274 0 0 0 .066.26l2.538 2.591-2.795 2.739c-.009.009-.006.021-.013.03-.023.028-.03.058-.04.093-.01.034-.02.062-.015.096.001.012-.009.022-.006.035.009.036.033.062.055.09.007.01.004.023.013.033l.016.016c.06.052.137.063.212.052.01-.002.016.008.026.005l7.416-1.815a.273.273 0 0 0 .195-.327.271.271 0 0 0-.066-.122ZM75.75 45.82l-2.968-2.084 2.249-3.203c.007-.01.001-.021.007-.031.017-.032.019-.061.022-.097.003-.036.007-.065-.003-.1-.003-.011.004-.022-.002-.033-.01-.023-.034-.029-.049-.048-.014-.018-.017-.046-.039-.062-.01-.007-.023-.001-.033-.007-.033-.017-.065-.019-.102-.022a.25.25 0 0 0-.093.003c-.011.003-.023-.004-.034.002l-6.961 3.138a.276.276 0 0 0-.156.218.275.275 0 0 0 .112.245l2.969 2.084-2.248 3.202c-.007.01-.001.022-.007.032-.017.032-.019.062-.022.098-.003.035-.007.065.003.098.003.012-.004.024.002.035.016.033.044.055.07.078.009.009.009.022.02.029l.018.012a.246.246 0 0 0 .218.011c.009-.003.017.006.026.002l6.96-3.14a.274.274 0 0 0 .155-.219.289.289 0 0 0-.114-.241Z'
        />
      </g>
      <defs>
        <clipPath id='a'>
          <path fill='#fff' d='M24 24h52v52H24z' />
        </clipPath>
      </defs>
    </AppIcon>
  ),
}
