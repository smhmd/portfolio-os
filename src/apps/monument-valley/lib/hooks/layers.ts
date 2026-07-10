import { useFrame, useThree } from '@react-three/fiber'

export function useLayers(count: number) {
  const { gl, scene, camera } = useThree()

  useFrame(() => {
    gl.clear()

    for (let i = 0; i < count; i++) {
      camera.layers.set(i)
      gl.render(scene, camera)

      if (i < count - 1) gl.clearDepth()
    }
  }, 1)
}
