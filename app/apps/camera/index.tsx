import { useEffect, useRef } from 'react'

import { AppIcon, AppWraper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Camera' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [favicon]
}

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    requestCameraAccess()

    // Cleanup function to stop the camera when the component unmounts
    return () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  return (
    <AppWraper className='flex items-center justify-center bg-black' fullscreen>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className='h-full w-full object-cover'></video>
    </AppWraper>
  )
}

export const metadata: AppMetadata = {
  id: 'camera',
  name: 'Camera',
  Icon: (props) => (
    <AppIcon fill='#FF0045' {...props}>
      <path
        d='M70.182 27.637H29.818A9.818 9.818 0 0 0 20 37.455v25.09a9.818 9.818 0 0 0 9.818 9.819h40.364A9.818 9.818 0 0 0 80 62.546V37.455a9.818 9.818 0 0 0-9.818-9.818ZM50 60.909A10.909 10.909 0 1 1 60.91 50 10.864 10.864 0 0 1 50 60.91Zm18.182-16.09a6 6 0 1 1 0-12.002 6 6 0 0 1 0 12.002Z'
        fill='#fff'
      />
    </AppIcon>
  ),
}
