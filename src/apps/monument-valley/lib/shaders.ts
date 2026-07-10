import { Color, ShaderMaterial } from 'three'

const COLOR = new Color('#ffffff')
const LINE_OPACITY = 0.18

// Stars sit at fixed clip-space positions (the camera is ignored) and twinkle.
const starsVert = /* glsl */ `
  uniform float uTime, uDpr;
  attribute float aSize, aPhase;
  varying float vTwinkle;
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
    gl_PointSize = aSize * uDpr;
    vTwinkle = 0.55 + 0.45 * sin(2.0 * uTime + aPhase);
  }
`
const starsFrag = /* glsl */ `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    float glow = smoothstep(0.5, 0.0, distance(gl_PointCoord, vec2(0.5)));
    gl_FragColor = vec4(uColor, glow * vTwinkle);
  }
`

// Lines must ALSO bypass the camera (same clip-space trick as the stars) — run
// through the default projection their NDC coords land off-screen, i.e. you see
// nothing. A gentle breathe keeps them from feeling dead.
const linesVert = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const linesFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`

// Built once, shared. Everything except dpr is constant so it's baked in here;
// dpr comes from the renderer and is synced each frame.
const stars = new ShaderMaterial({
  vertexShader: starsVert,
  fragmentShader: starsFrag,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: COLOR },
    uDpr: { value: 1 },
  },
})

const lines = new ShaderMaterial({
  vertexShader: linesVert,
  fragmentShader: linesFrag,
  transparent: true,
  depthTest: false,
  depthWrite: false,
  uniforms: {
    uColor: { value: COLOR },
    uOpacity: { value: LINE_OPACITY },
  },
})

export const shaders = {
  stars,
  lines,
}
