import { useFrame } from '@react-three/fiber'

import { geometries } from '../lib/geometry'
import { shaders } from '../lib/shaders'

export function Stars() {
  useFrame(({ clock, viewport }) => {
    const t = clock.elapsedTime
    shaders.stars.uniforms.uDpr.value = viewport.dpr
    shaders.stars.uniforms.uTime.value = t
  })

  return (
    <>
      <lineSegments
        geometry={geometries.lines}
        material={shaders.lines}
        frustumCulled={false}
        renderOrder={0}
      />
      <points
        geometry={geometries.stars}
        material={shaders.stars}
        frustumCulled={false}
        renderOrder={1}
      />
    </>
  )
}
