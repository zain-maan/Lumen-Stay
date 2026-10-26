import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'
import { imageSrc } from './Img'

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`

// Draws the hero photo "cover"-fitted, with a gentle swell on the sea in the lower half and
// rings that spread out from the pointer like a stone dropped in water.
const FRAGMENT = /* glsl */ `
precision highp float;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uMouse;
uniform float uTime;
uniform float uStrength;
uniform vec3 uDrops[6]; // xy = position, z = start time
varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  float screen = uResolution.x / uResolution.y;
  float image = uImageSize.x / uImageSize.y;
  vec2 scale = screen > image ? vec2(1.0, image / screen) : vec2(screen / image, 1.0);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / uResolution.y;

  // Ambient swell, strongest towards the bottom of the frame where the sea is.
  float sea = smoothstep(0.62, 0.0, uv.y);
  vec2 swell = vec2(
    sin(uv.y * 38.0 + uTime * 1.1) * 0.0016,
    cos(uv.x * 22.0 + uTime * 0.8) * 0.0012
  ) * sea;

  // Rings around the pointer and recent drops.
  vec2 ripple = vec2(0.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(uMouse.x * aspect, uMouse.y);
  float d = distance(p, m);
  ripple += normalize(p - m + 1e-5) * sin(d * 55.0 - uTime * 7.0) * exp(-d * 9.0) * 0.012 * uStrength;
  for (int i = 0; i < 6; i++) {
    float age = uTime - uDrops[i].z;
    if (age < 0.0 || age > 2.6) continue;
    vec2 c = vec2(uDrops[i].x * aspect, uDrops[i].y);
    float r = distance(p, c);
    float front = age * 0.35;
    float ring = exp(-pow((r - front) * 18.0, 2.0)) * (1.0 - age / 2.6);
    ripple += normalize(p - c + 1e-5) * ring * 0.018;
  }

  vec2 offset = swell + ripple;
  vec2 base = coverUv(uv + offset);
  // A touch of colour split where the water moves, like light through a wave.
  float split = length(ripple) * 0.6;
  vec3 colour = vec3(
    texture2D(uImage, base + vec2(split, 0.0)).r,
    texture2D(uImage, base).g,
    texture2D(uImage, base - vec2(split, 0.0)).b
  );
  // Glints on the crests.
  colour += vec3(1.0, 0.92, 0.8) * pow(max(0.0, length(ripple) * 40.0), 2.0) * 0.25;
  gl_FragColor = vec4(colour, 1.0);
}`

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// Sits over the hero <Img>, which stays underneath as the fallback and the first paint.
export default function HeroWater() {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion() || !webglAvailable()) return
    let disposed = false
    let cleanup = () => {}

    import('../lib/three').then((THREE) => {
      if (disposed || !host.current) return
      const el = host.current
      const mobile = window.matchMedia('(pointer: coarse)').matches
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5))
      el.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%'

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const uniforms = {
        uImage: { value: null as unknown as InstanceType<typeof THREE.Texture> },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uImageSize: { value: new THREE.Vector2(16, 9) },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uStrength: { value: 0 },
        uDrops: { value: Array.from({ length: 6 }, () => new THREE.Vector3(0, 0, -10)) },
      }
      const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms })
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

      const resize = () => {
        const { width, height } = el.getBoundingClientRect()
        renderer.setSize(width, height, false)
        uniforms.uResolution.value.set(width, height)
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      // Reuse whichever file the <img> underneath picked (AVIF or WebP, right size), so the photo
      // is only downloaded once.
      const photo = el.parentElement?.querySelector('img')
      const src = photo?.currentSrc || imageSrc('hero', window.innerWidth > 1000 ? 1600 : 960)
      new THREE.TextureLoader().load(src, (tex) => {
        if (disposed) return tex.dispose()
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        uniforms.uImage.value = tex
        uniforms.uImageSize.value.set(tex.image.width, tex.image.height)
        setReady(true)
        start()
      })

      // Pointer: rings follow movement, a tap or click drops a bigger ripple.
      const target = new THREE.Vector2(0.5, 0.5)
      let energy = 0
      let drop = 0
      const toUv = (x: number, y: number) => {
        const r = el.getBoundingClientRect()
        return new THREE.Vector2((x - r.left) / r.width, 1 - (y - r.top) / r.height)
      }
      const onMove = (e: PointerEvent) => {
        const uv = toUv(e.clientX, e.clientY)
        energy = Math.min(1, energy + target.distanceTo(uv) * 6)
        target.copy(uv)
      }
      const onDown = (e: PointerEvent) => {
        const uv = toUv(e.clientX, e.clientY)
        uniforms.uDrops.value[drop++ % 6].set(uv.x, uv.y, uniforms.uTime.value)
      }
      // Listen on the whole hero: the text and gradient layers sit above the canvas.
      const section = el.closest('section') ?? el.parentElement!
      section.addEventListener('pointermove', onMove)
      section.addEventListener('pointerdown', onDown)

      // Only render while the hero is on screen.
      let visible = true
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
      })
      io.observe(el)

      const clock = new THREE.Clock()
      let raf = 0
      let lastAuto = 0
      const frame = () => {
        raf = 0
        if (!visible || disposed) return
        const t = clock.getElapsedTime()
        uniforms.uTime.value = t
        uniforms.uMouse.value.lerp(target, 0.12)
        energy *= 0.95
        uniforms.uStrength.value += (energy - uniforms.uStrength.value) * 0.1
        // On touch screens nobody hovers, so drop an occasional ripple on the water.
        if (mobile && t - lastAuto > 3.2) {
          lastAuto = t
          uniforms.uDrops.value[drop++ % 6].set(0.2 + Math.random() * 0.6, 0.12 + Math.random() * 0.3, t)
        }
        renderer.render(scene, camera)
        raf = requestAnimationFrame(frame)
      }
      function start() {
        if (!raf && uniforms.uImage.value) raf = requestAnimationFrame(frame)
      }

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        section.removeEventListener('pointermove', onMove)
        section.removeEventListener('pointerdown', onDown)
        uniforms.uImage.value?.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return <div ref={host} aria-hidden="true" className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />
}
