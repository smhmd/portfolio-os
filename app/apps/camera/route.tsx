import { useEffect, useRef } from 'react'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { AppIcon, metadata } from './metadata'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon />)
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
    <AppWrapper className='flex items-center justify-center bg-black'>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className='size-full object-cover'></video>
    </AppWrapper>
  )
}
