import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './ChatbotSphere.css'

export default function ChatbotSphere() {
  const containerRef = useRef(null)
  const timeRef = useRef(0)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // ============ SCENE SETUP ============
    const scene = new THREE.Scene()
    const width = 120
    const height = 120
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 60

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)

    // Minimal lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
    scene.add(ambientLight)

    // Lumière violette
    const pointLight = new THREE.PointLight(0x9d4edd, 2.0, 100)
    pointLight.position.set(0, 0, 40)
    scene.add(pointLight)

    // ============ CUSTOM SHADER MATERIAL ============
    const vertexShader = `
      uniform float uTime;
      varying vec3 vPos;
      varying vec3 vColor;

      float noise(vec3 p) {
        return sin(p.x * 3.0) * cos(p.y * 2.5) * sin(p.z * 2.0) +
               sin(p.x * 5.2 + p.y * 3.1) * cos(p.z * 4.7) * 0.5 +
               sin(p.x * 7.3 + p.y * 2.1 + p.z * 5.1) * 0.3;
      }

      float getDeepCrevasse(vec3 pos) {
        float deepCrevasse = 0.0;
        float dist1 = distance(normalize(pos), normalize(vec3(0.5, 0.7, 0.3)));
        deepCrevasse += exp(-dist1 * 8.0) * sin(pos.x * 10.0);
        float dist2 = distance(normalize(pos), normalize(vec3(-0.6, 0.4, -0.2)));
        deepCrevasse += exp(-dist2 * 8.0) * sin(pos.y * 10.0);
        float dist3 = distance(normalize(pos), normalize(vec3(0.2, -0.8, 0.4)));
        deepCrevasse += exp(-dist3 * 8.0) * sin(pos.z * 10.0);
        return deepCrevasse;
      }

      void main() {
        vPos = position;
        vec3 normal = normalize(position);

        float surfaceNoise = noise(position * 2.5) * 1.2;
        float crevasses = sin(position.x * 12.0 + uTime * 0.1) *
                          sin(position.y * 9.0 + uTime * 0.08) *
                          sin(position.z * 10.0 + uTime * 0.06) * 0.5;

        float displacement = (surfaceNoise + crevasses) * 0.35;
        float deepCrevasse = getDeepCrevasse(position);
        float crevasseMask = abs(crevasses);
        float deepMask = abs(deepCrevasse);

        if (crevasseMask > 0.6 || deepMask > 0.4) {
          gl_PointSize = 0.0;
        }

        vec3 pos = position + normal * displacement;
        pos += normal * deepCrevasse * 0.5;
        pos += normal * sin(uTime * 0.5 + length(position)) * 0.15;

        // Rotation lente multi-axe
        float angleY = uTime * 0.1;
        float angleX = uTime * 0.06;

        // Rotation autour de Y
        float cosY = cos(angleY);
        float sinY = sin(angleY);
        vec3 rotY = vec3(
          pos.x * cosY - pos.z * sinY,
          pos.y,
          pos.x * sinY + pos.z * cosY
        );

        // Rotation autour de X
        float cosX = cos(angleX);
        float sinX = sin(angleX);
        vec3 pos_rotated = vec3(
          rotY.x,
          rotY.y * cosX - rotY.z * sinX,
          rotY.y * sinX + rotY.z * cosX
        );
        pos = pos_rotated;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        float imperfectionInfluence = abs(displacement) * 2.0;
        gl_PointSize = 0.6 + imperfectionInfluence * 0.25;

        float depth = normal.z * 0.5 + 0.5;
        vec3 baseColor = mix(
          vec3(0.3, 0.6, 1.0),
          vec3(0.9, 0.95, 1.0),
          depth
        );

        vColor = baseColor * (0.8 + imperfectionInfluence * 0.4);
      }
    `

    const fragmentShader = `
      varying vec3 vPos;
      varying vec3 vColor;
      uniform float uTime;

      void main() {
        vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
        float dist = dot(circCoord, circCoord);
        if (dist > 1.0) discard;

        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;

        float light = 0.8 + 0.15 * sin(uTime * 0.3 + vPos.x * 2.0);

        vec3 finalColor = vColor;

        gl_FragColor = vec4(finalColor * light, 1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 }
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    // ============ CREATE PARTICLES ============
    const particleCount = 5000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const radius = 25

      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // ============ ANIMATION LOOP ============
    const animate = () => {
      requestAnimationFrame(animate)
      timeRef.current += 0.016

      material.uniforms.uTime.value = timeRef.current

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      containerRef.current?.removeChild(renderer.domElement)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <div className="chatbot-sphere-container">
        <div ref={containerRef} className="sphere-canvas" onClick={() => setChatOpen(!chatOpen)} />
      </div>

      {chatOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <h3>Assistant NEA</h3>
            <button onClick={() => setChatOpen(false)} className="close-btn">✕</button>
          </div>
          <div className="chatbot-messages">
            <div className="message bot-message">
              Bonjour ! Comment puis-je vous aider ?
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Tapez votre message..." />
            <button>Envoyer</button>
          </div>
        </div>
      )}
    </>
  )
}
