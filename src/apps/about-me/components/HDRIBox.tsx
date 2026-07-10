import { useEffect } from 'react'

import { useEnvironment } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { BackSide, type WebGLProgramParametersWithUniforms } from 'three'

type HDRIBoxProps = {
  path: string
  size: {
    left: number
    right: number
    front: number
    back: number
    height: number
  }
  rotation?: number
  origin?: [number, number, number]
  scale?: number
  children?: React.ReactNode
}

const vertexVarying = /* glsl */ `
#include <common>
varying vec3 vWorldPos;
`

const vertexWorldPos = /* glsl */ `
#include <worldpos_vertex>
vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
`

const fragmentVarying = /* glsl */ `
#include <common>
varying vec3 vWorldPos;
uniform vec3 uOrigin;
uniform float uRotation;
uniform float uScale;
`

const fragProjection = /* glsl */ `
vec3 d = vWorldPos - uOrigin;
d.y /= uScale;
d = normalize(d);
float c = cos(uRotation), s = sin(uRotation);
d.xz = mat2(c, -s, s, c) * d.xz;
vec2 uv = vec2(
  atan(d.z, d.x) * RECIPROCAL_PI2 + 0.5,
  asin(clamp(d.y, -1., 1.)) * RECIPROCAL_PI + 0.5
);
diffuseColor *= texture2D(map, uv);
`

export function HDRIBox({
  path,
  size: { left, right, front, back, height },
  rotation = 0,
  origin = [0, 1.5, 0],
  scale = 1,
  children,
}: HDRIBoxProps) {
  const texture = useEnvironment({ files: path })
  const { scene } = useThree()

  useEffect(() => {
    scene.environment = texture
    scene.environmentRotation.y = rotation
    scene.environmentIntensity = 0.6
    return () => {
      scene.environment = null
    }
  }, [scene, texture, rotation])

  function handleBeforeCompile(shader: WebGLProgramParametersWithUniforms) {
    shader.uniforms.uOrigin = { value: origin }
    shader.uniforms.uRotation = { value: -rotation }
    shader.uniforms.uScale = { value: scale }

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', vertexVarying)
      .replace('#include <worldpos_vertex>', vertexWorldPos)

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', fragmentVarying)
      .replace('#include <map_fragment>', fragProjection)
  }

  return (
    <mesh
      receiveShadow
      position={[(right - left) / 2, height / 2, (front - back) / 2]}>
      {children ?? <boxGeometry args={[left + right, height, front + back]} />}
      <meshStandardMaterial
        // remount (recompile) only when projection inputs change
        key={`${rotation}-${scale}-${origin.join(',')}`}
        roughness={1}
        map={texture}
        side={BackSide}
        onBeforeCompile={handleBeforeCompile}
      />
    </mesh>
  )
}
