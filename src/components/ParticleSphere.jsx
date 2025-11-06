import { useEffect, useRef } from 'react'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PointLight,
  ShaderMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  AdditiveBlending,
  SRGBColorSpace,
  NormalBlending,
  Vector2
} from 'three'

export default function ParticleSphere() {
  const containerRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const timeRef = useRef(0)
  const waveTimeRef = useRef(0)
  const sphereOffsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // ============ SCENE SETUP ============
    const scene = new Scene()
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 60

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x191919)
    renderer.outputColorSpace = SRGBColorSpace
    containerRef.current.appendChild(renderer.domElement)

    // Minimal lighting
    const ambientLight = new AmbientLight(0xffffff, 1.0)
    scene.add(ambientLight)

    // Lumière violette interactive suivant la souris
    const pointLight = new PointLight(0x9d4edd, 2.0, 100)
    pointLight.position.set(0, 0, 40)
    scene.add(pointLight)

    // ============ CUSTOM SHADER MATERIAL ============
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uWaveTime;
      varying vec3 vPos;
      varying vec3 vColor;
      varying float vMouse;

      float noise(vec3 p) {
        return sin(p.x * 3.0) * cos(p.y * 2.5) * sin(p.z * 2.0) +
               sin(p.x * 5.2 + p.y * 3.1) * cos(p.z * 4.7) * 0.5 +
               sin(p.x * 7.3 + p.y * 2.1 + p.z * 5.1) * 0.3;
      }

      float getDeepCrevasse(vec3 pos) {
        // Simplified version: use position directly instead of distance calculations
        float deepCrevasse = sin(pos.x * 8.0) * 0.3 +
                            sin(pos.y * 7.0) * 0.25 +
                            sin(pos.z * 6.0) * 0.2;
        return deepCrevasse * 0.5;
      }

      void main() {
        vPos = position;
        vec3 normal = normalize(position);

        float mouseDist = distance(vec2(position.x, position.y), uMouse * 50.0);
        vMouse = mouseDist;

        float surfaceNoise = noise(position * 3.0) * 1.5;
        float crevasses = sin(position.x * 15.0 + uTime * 0.2) *
                          sin(position.y * 11.0 + uTime * 0.15) *
                          sin(position.z * 12.0 + uTime * 0.1) * 0.7;

        // Créer une vague douce qui suit la souris
        float waveDistance = distance(vec2(position.x, position.y), uMouse * 50.0);
        float wave = sin(waveDistance * 0.1 - uWaveTime * 2.0) * 0.5 + 0.5;
        float waveStrength = max(0.0, 1.0 - waveDistance / 30.0);
        float wavePulse = wave * waveStrength * 0.3;

        float displacement = (surfaceNoise + crevasses) * 0.6;
        float deepCrevasse = getDeepCrevasse(position);
        float crevasseMask = abs(crevasses);
        float deepMask = abs(deepCrevasse);

        if (crevasseMask > 0.5 || deepMask > 0.3) {
          gl_PointSize = 0.0;
        }

        vec3 pos = position + normal * displacement;
        pos += normal * deepCrevasse * 0.5;
        pos += normal * sin(uTime * 0.5 + length(position)) * 0.15;
        pos += normal * wavePulse * 1.5;

        // Simplified drift: reduced sin/cos calculations
        float moveX = sin(position.y * 1.5 + uTime * 0.03);
        float moveY = cos(position.x * 1.5 + uTime * 0.03);
        float moveZ = sin((position.x + position.y) * 1.0 + uTime * 0.02);

        vec3 drift = vec3(moveX, moveY, moveZ) * 0.1;
        pos += drift;

        float pull = max(0.0, 1.0 - mouseDist / 40.0) * 0.1;
        pos += vec3(uMouse * 0.4, 0.0) * pull;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        float imperfectionInfluence = abs(displacement) * 2.0;
        gl_PointSize = 1.5 + pull * 1.0 + imperfectionInfluence * 0.5;

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
      varying float vMouse;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uWaveTime;

      void main() {
        vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
        float dist = dot(circCoord, circCoord);
        if (dist > 1.0) discard;

        if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;

        float light = 0.85 + 0.15 * sin(uTime * 1.5 + vPos.x);

        // Simplified flash effect
        float flash = sin(uTime * 2.0 + vPos.x * 5.0 + vPos.y * 5.0) * 0.5 + 0.5;
        vec3 flashColor = vec3(0.9, 0.3, 1.0);
        vec3 finalColor = mix(vColor, flashColor, flash * 0.2);

        // Simplified mouse influence
        float mouseInfluence = max(0.0, 1.0 - vMouse / 15.0);
        vec3 violetLight = vec3(1.0, 0.4, 1.0) * mouseInfluence * 1.5;
        finalColor += violetLight;

        float alpha = (1.0 - dist * dist) * 0.8;

        gl_FragColor = vec4(finalColor * light, alpha);
      }
    `

    // ============ CREATE PARTICLE SPHERE ============
    const particleCount = 15000
    const geometry = new BufferGeometry()
    const positions = new Float32Array(particleCount * 3)

    const sphereRadius = 25

    const noise = (p) => {
      return Math.sin(p.x * 3.0) * Math.cos(p.y * 2.5) * Math.sin(p.z * 2.0) +
             Math.sin(p.x * 5.2 + p.y * 3.1) * Math.cos(p.z * 4.7) * 0.5 +
             Math.sin(p.x * 7.3 + p.y * 2.1 + p.z * 5.1) * 0.3
    }

    const golden_ratio = (1 + Math.sqrt(5)) / 2

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * i / particleCount - 1)
      const phi = 2 * Math.PI * i / golden_ratio

      let x = sphereRadius * Math.sin(theta) * Math.cos(phi)
      let y = sphereRadius * Math.sin(theta) * Math.sin(phi)
      let z = sphereRadius * Math.cos(theta)

      const surfaceNoise = noise({ x: x * 3.0, y: y * 3.0, z: z * 3.0 }) * 1.5
      const crevasseFactor = Math.sin(x * 15.0) * Math.sin(y * 11.0) * Math.sin(z * 12.0) * 0.7
      const displacement = (surfaceNoise + crevasseFactor) * 0.6

      const normal = Math.sqrt(x * x + y * y + z * z)
      x += (x / normal) * displacement
      y += (y / normal) * displacement
      z += (z / normal) * displacement

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0, 0) },
      uWaveTime: { value: 0 }
    }

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      blending: NormalBlending,
      depthWrite: false,
      depthTest: true
    })

    const particles = new Points(geometry, material)
    scene.add(particles)

    // ============ VIOLET PARTICLE LAYER ============
    const violetGeometry = new BufferGeometry()
    const violetPositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.acos(2 * i / particleCount - 1)
      const phi = 2 * Math.PI * i / golden_ratio

      let x = sphereRadius * Math.sin(theta) * Math.cos(phi)
      let y = sphereRadius * Math.sin(theta) * Math.sin(phi)
      let z = sphereRadius * Math.cos(theta)

      const surfaceNoise = noise({ x: x * 3.0, y: y * 3.0, z: z * 3.0 }) * 1.5
      const crevasseFactor = Math.sin(x * 15.0) * Math.sin(y * 11.0) * Math.sin(z * 12.0) * 0.7
      const displacement = (surfaceNoise + crevasseFactor) * 0.6

      const normal = Math.sqrt(x * x + y * y + z * z)
      const normalizedX = x / normal
      const normalizedY = y / normal
      const normalizedZ = z / normal

      // Ajouter un offset vers l'extérieur pour la couche violette
      x += normalizedX * (displacement + 3.0)
      y += normalizedY * (displacement + 3.0)
      z += normalizedZ * (displacement + 3.0)

      violetPositions[i * 3] = x
      violetPositions[i * 3 + 1] = y
      violetPositions[i * 3 + 2] = z
    }

    violetGeometry.setAttribute('position', new BufferAttribute(violetPositions, 3))

    const violetMaterial = new ShaderMaterial({
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uWaveTime;
        varying vec3 vPos;
        varying float vMouse;
        varying float vMouseInfluence;

        void main() {
          vPos = position;

          // Calculer la distance à la souris
          float mouseDist = distance(vec2(position.x, position.y), uMouse * 50.0);
          vMouse = mouseDist;

          // L'influence diminue avec la distance (rayon plus large)
          vMouseInfluence = max(0.0, 1.0 - mouseDist / 25.0);

          // Déplacer les particules vers la souris
          vec3 pos = position;

          // Direction vers la souris
          vec2 toMouse = uMouse * 50.0 - vec2(position.x, position.y);
          vec2 mouseDir = normalize(toMouse);
          float distToMouse = length(toMouse);

          // Attraction continue vers la souris (mais sans jamais l'atteindre)
          float minDistance = 3.0; // Distance minimale, jamais plus proche
          float attractionForce = max(0.0, distToMouse - minDistance) * 0.15;

          pos.x += mouseDir.x * attractionForce;
          pos.y += mouseDir.y * attractionForce;

          // Mouvement circulaire qui tourne autour de la souris (basé sur uTime pour continuité)
          float circleSpeed = uTime * 0.2;
          float circleRadius = mix(8.0, 2.0, vMouseInfluence); // Rayon décroît en s'approchant

          vec2 circlePos = vec2(
            cos(circleSpeed + position.x * 0.05) * circleRadius,
            sin(circleSpeed + position.y * 0.05) * circleRadius
          );

          pos.x += circlePos.x * vMouseInfluence * 0.5;
          pos.y += circlePos.y * vMouseInfluence * 0.5;

          // Perturbation verticale fluide (continu)
          pos.z += sin(uTime * 0.3 + position.z * 0.1) * vMouseInfluence * 1.0;

          // Mouvement de dérive supplémentaire pour plus de dynamisme
          pos.x += sin(uTime * 0.15 + position.y * 0.05) * vMouseInfluence * 0.8;
          pos.y += cos(uTime * 0.18 + position.x * 0.05) * vMouseInfluence * 0.8;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 2.0 + vMouseInfluence * 1.5;
        }
      `,
      fragmentShader: `
        varying vec3 vPos;
        varying float vMouse;
        varying float vMouseInfluence;

        void main() {
          vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
          float dist = dot(circCoord, circCoord);
          if (dist > 1.0) discard;

          // Couleur violette brillante pour le nuage
          float alpha = vMouseInfluence * 0.8 * (1.0 - dist * dist);

          // Couleur plus intense au centre
          vec3 violetColor = vec3(0.9, 0.3, 1.0);

          gl_FragColor = vec4(violetColor, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0, 0) },
        uWaveTime: { value: 0 }
      },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      depthTest: true
    })

    const violetParticles = new Points(violetGeometry, violetMaterial)
    scene.add(violetParticles)

    // ============ INTERACTION ============
    const handleMouseMove = (event) => {
      mouseRef.current.targetX = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.targetY = -(event.clientY / window.innerHeight) * 2 + 1

      // Positionner la lumière violette basée sur la position de la souris
      const x = (event.clientX / window.innerWidth - 0.5) * 80
      const y = -(event.clientY / window.innerHeight - 0.5) * 80
      pointLight.position.set(x, y, 40)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // ============ ANIMATION LOOP ============
    const animate = () => {
      requestAnimationFrame(animate)

      timeRef.current += 0.016
      uniforms.uTime.value = timeRef.current
      violetMaterial.uniforms.uTime.value = timeRef.current

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)
      violetMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y)

      // Augmenter waveTime seulement si la souris bouge
      const mouseMoved = Math.abs(mouseRef.current.targetX - mouseRef.current.x) > 0.001 || Math.abs(mouseRef.current.targetY - mouseRef.current.y) > 0.001
      if (mouseMoved) {
        waveTimeRef.current += 0.016
      }
      uniforms.uWaveTime.value = waveTimeRef.current
      violetMaterial.uniforms.uWaveTime.value = waveTimeRef.current

      // Attirer la sphère vers la souris (mouvements très subtils)
      const targetX = mouseRef.current.x * 2
      const targetY = mouseRef.current.y * 2

      sphereOffsetRef.current.x += (targetX - sphereOffsetRef.current.x) * 0.05
      sphereOffsetRef.current.y += (targetY - sphereOffsetRef.current.y) * 0.05

      particles.position.x = sphereOffsetRef.current.x
      particles.position.y = sphereOffsetRef.current.y
      violetParticles.position.x = sphereOffsetRef.current.x
      violetParticles.position.y = sphereOffsetRef.current.y

      particles.rotation.y += 0.0001
      particles.rotation.x += 0.00005
      violetParticles.rotation.y += 0.0001
      violetParticles.rotation.x += 0.00005

      renderer.render(scene, camera)
    }

    animate()

    // ============ RESPONSIVE ============
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // ============ CLEANUP ============
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      violetGeometry.dispose()
      violetMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      style={{
        width: '60%',
        background: '#191919',
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }}
    >
      <div ref={containerRef} style={{ display: 'block', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Labels et traits */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        {/* SVG pour les traits */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* TOP LEFT - trait blanc */}
          <polyline
            points="10,23 13,23 21,27 31,27"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.25"
            fill="none"
          />

          {/* TOP RIGHT - trait blanc */}
          <polyline
            points="90,23 87,23 79,27 69,27"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.25"
            fill="none"
          />

          {/* BOTTOM LEFT - trait blanc */}
          <polyline
            points="10,77 13,77 21,73 31,73"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.25"
            fill="none"
          />

          {/* BOTTOM RIGHT - trait blanc */}
          <polyline
            points="90,77 87,77 79,73 69,73"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="0.25"
            fill="none"
          />
        </svg>

        {/* Top Left Label */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            left: '3%',
            fontFamily: "'Gravesend Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            lineHeight: '1.2'
          }}
        >
          <div>PRÉSENCE INTELLIGENTE</div>
          <div style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.5px' }}>
            Veille Silencieuse
          </div>
        </div>

        {/* Bottom Left Label */}
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '3%',
            fontFamily: "'Gravesend Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            lineHeight: '1.2'
          }}
        >
          <div>PROTECTION INVISIBLE</div>
          <div style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.5px' }}>
            Sécurité Discrète
          </div>
        </div>

        {/* Top Right Label */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            right: '3%',
            fontFamily: "'Gravesend Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            lineHeight: '1.2',
            textAlign: 'right'
          }}
        >
          <div>CONTRÔLE ADAPTATIF</div>
          <div style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.5px' }}>
            Réaction instantanée
          </div>
        </div>

        {/* Bottom Right Label */}
        <div
          style={{
            position: 'absolute',
            bottom: '18%',
            right: '3%',
            fontFamily: "'Gravesend Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            lineHeight: '1.2',
            textAlign: 'right'
          }}
        >
          <div>ANTICIPATION CONTINUE</div>
          <div style={{ fontSize: '11px', fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', letterSpacing: '0.5px' }}>
            Prévoyance dynamique
          </div>
        </div>
      </div>
    </div>
  )
}
