import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import HeroNavbar from '../components/HeroNavbar'
import './Home.css'

// Lazy load heavy Three.js components
const ParticleSphere = lazy(() => import('../components/ParticleSphere'))
const ChatbotSphere = lazy(() => import('../components/ChatbotSphere'))

export default function Home() {
  const [activeLumiere, setActiveLumiere] = useState('son')
  const [renderParticleSphere, setRenderParticleSphere] = useState(false)
  const [renderChatbotSphere, setRenderChatbotSphere] = useState(false)
  const testimonialRef = useRef(null)
  const neaSectionRef = useRef(null)
  const neaTitleRef = useRef(null)
  const neaTextRef = useRef(null)
  const neaContainerRef = useRef(null)
  const sphereRef = useRef(null)
  const connectSectionRef = useRef(null)
  const rightTextRef = useRef(null)
  const chatbotRef = useRef(null)

  const lumiereContent = {
    son: {
      image: 'url("/img/Univers Son.webp")',
      title: 'Le Son Invisible',
      subtitle: 'La mélodie de vos désirs',
      text: 'Un son qui n\'a pas de visage, mais qui habille chaque espace d\'une ambiance parfaite. Notre technologie acoustique se fond dans le décor, pour que vous ne perceviez que la magie du moment.'
    },
    lumiere: {
      image: 'url("/img/Univers Lumière.webp")',
      title: 'La Lumière Sculptée',
      subtitle: 'L\'art de révéler vos espaces',
      text: 'La lumière devient une alliée invisible. Elle sculpte vos pièces avec une délicatesse imperceptible, révélant l\'atmosphère parfaite à chaque instant, sans jamais perturber l\'harmonie visuelle.'
    },
    univers: {
      image: 'url("/img/Univers Connecté.webp")',
      title: 'Les Univers Connectés',
      subtitle: 'L\'anticipation de vos envies',
      text: 'Vos espaces devancent vos désirs. Une technologie invisible orchestre chaque détail, pour que votre environnement s\'adapte sans effort, anticipant chacun de vos besoins.'
    }
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('nea-section')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const textObserverOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    }

    const textObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('nea-text')
          textObserver.unobserve(entry.target)
        }
      })
    }, textObserverOptions)

    const sphereObserverOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const sphereObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('particle-sphere-animated')
          // Trigger rendering of ParticleSphere when visible
          setRenderParticleSphere(true)
          sphereObserver.unobserve(entry.target)
        }
      })
    }, sphereObserverOptions)

    const chatbotObserverOptions = {
      threshold: 0.1,
      rootMargin: '100px'
    }

    const chatbotObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger rendering of ChatbotSphere when visible
          setRenderChatbotSphere(true)
          chatbotObserver.unobserve(entry.target)
        }
      })
    }, chatbotObserverOptions)

    if (neaTitleRef.current) observer.observe(neaTitleRef.current)
    if (neaTextRef.current) textObserver.observe(neaTextRef.current)
    if (sphereRef.current) sphereObserver.observe(sphereRef.current)
    if (chatbotRef.current) chatbotObserver.observe(chatbotRef.current)

    // Scroll parallax pour la section NEA Connect et NEA
    const handleConnectScroll = () => {
      const windowHeight = window.innerHeight
      const screenMiddle = windowHeight / 2

      // Logique pour la section NEA
      if (neaContainerRef.current) {
        const neaRect = neaContainerRef.current.getBoundingClientRect()
        const neaTop = neaRect.top
        const neaHeight = neaRect.height

        // Calculer le progress basé sur la distance au milieu de l'écran
        const distanceToMiddle = neaTop + neaHeight / 2 - screenMiddle
        const triggerDistance = 150
        const neaOpacity = Math.max(0, Math.min(1, (triggerDistance - distanceToMiddle) / triggerDistance))

        neaContainerRef.current.style.opacity = neaOpacity
      }

      // Logique pour la section NEA Connect
      if (!rightTextRef.current || !connectSectionRef.current) return

      const sectionRect = connectSectionRef.current.getBoundingClientRect()
      const sectionTop = sectionRect.top
      const sectionHeight = sectionRect.height

      // Calcule le pourcentage de scroll dans la section (0 à 1)
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)))

      // Applique un parallax et change la boldness du texte
      const yOffset = scrollProgress * 50
      const fontWeightValue = 300 + (scrollProgress * 400)

      rightTextRef.current.style.transform = `translateY(${yOffset}px)`

      // Change la font-weight progressivement et la couleur pour les paragraphes gris
      const elements = rightTextRef.current.querySelectorAll('p')
      const fadeElements = Array.from(elements).filter(el => el.getAttribute('data-fade') === 'true')

      elements.forEach((el) => {
        el.style.fontWeight = Math.round(fontWeightValue)

        // Pour les éléments avec data-fade, créer un effet ligne par ligne
        if (el.getAttribute('data-fade') === 'true') {
          const elementIndex = fadeElements.indexOf(el)

          // Obtenir la position de l'élément au milieu de l'écran
          const elRect = el.getBoundingClientRect()
          const elTop = elRect.top
          const elHeight = elRect.height
          const elMiddle = elTop + elHeight / 2

          // Calculer la distance au milieu de l'écran
          const distanceToMiddle = elMiddle - screenMiddle

          // Zone de transition : 100px avant et après le milieu
          const transitionRange = 100

          // Vérifier si l'élément est dans la zone blanche (3 lignes)
          // La zone blanche sera centrée au milieu de l'écran
          const distFromCenter = Math.abs(distanceToMiddle)

          // Les 3 lignes au milieu seront blanches (estimé à ~47px par ligne avec fontSize 36px)
          const isInWhiteZone = distFromCenter < 70

          if (isInWhiteZone) {
            // Blanc complet
            el.style.color = `rgb(255, 255, 255)`
          } else {
            // Gris
            el.style.color = `rgb(141, 141, 141)`
          }
        }
      })
    }

    window.addEventListener('scroll', handleConnectScroll)

    return () => {
      observer.disconnect()
      textObserver.disconnect()
      sphereObserver.disconnect()
      chatbotObserver.disconnect()
      window.removeEventListener('scroll', handleConnectScroll)
    }
  }, [])

  return (
    <div className="home">
      <section className="hero" style={{ backgroundImage: "url('/img/Image héroïque.webp')" }}>
        <HeroNavbar />
        <div className="hero-overlay">

          {/* Main Content */}
          <div className="hero-content">
            <h1 className="hero-title">
              RÊVEZ L'IMPOSSIBLE,<br />
              <span className="highlight">VIVEZ L'INVISIBLE</span>
            </h1>
            <p className="hero-subtitle">
              Explorez des solutions invisibles qui transforment vos espaces en créant des espaces à la hauteur de vos rêves.
            </p>
          </div>
        </div>
      </section>

      <section className="testimonial" ref={testimonialRef} style={{ minHeight: '40vh' }}>
        <div className="testimonial-content">
          <p className="testimonial-quote">
            <span className="quote-bold">Nous concevons</span> <span className="quote-light">des espaces où l'invisible rend possible l'impossible.</span>
          </p>
          <p className="testimonial-author">
            Sébastien Pêtre, Co-fondateur
          </p>
          <a href="#interview" className="testimonial-link">
            Lire l'interview
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="link-arrow">
              <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="secrets-section" style={{ padding: '40px 100px' }}>
        <div className="secrets-container">
          <div className="secrets-text">
            <h2 className="secrets-title">
              <span className="secrets-light">Trois secrets pour</span><br />
              <span className="secrets-bold">donner vie à vos rêves</span>
            </h2>
            <p className="secrets-description">
              Nos trois piliers technologiques réinventent l'élégance et l'innovation pour matérialiser vos rêves les plus audacieux
            </p>
          </div>
          <div className="secrets-image">
            <img src="/img/Section 3.webp" alt="Section 3" width="425" height="380" loading="lazy" />
          </div>
        </div>
      </section>

      <section style={{ padding: '100px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minHeight: '100vh', position: 'relative', paddingTop: '40px', backgroundColor: '#191919', overflow: 'hidden' }}>
        {/* Current background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: lumiereContent[activeLumiere].image, backgroundPosition: 'center center', backgroundSize: 'cover', backgroundAttachment: 'fixed', opacity: 1, transition: 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)', zIndex: 0 }}></div>
        {/* Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1 }}></div>

        {/* Pill navigation - positioned at top */}
        <div style={{ position: 'absolute', top: '40px', left: '0', right: '0', width: '100%', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '50px', padding: '6px', backdropFilter: 'blur(10px)', gap: '0', maxWidth: '500px', width: '90%' }}>
            <button onClick={() => setActiveLumiere('son')} style={{ flex: '1', padding: '12px 25px', border: 'none', backgroundColor: activeLumiere === 'son' ? 'rgba(38, 38, 38, 1)' : 'transparent', color: 'white', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50px', fontFamily: "'Gravesend Sans', sans-serif" }}>Son</button>
            <button onClick={() => setActiveLumiere('lumiere')} style={{ flex: '1', padding: '12px 25px', border: 'none', backgroundColor: activeLumiere === 'lumiere' ? 'rgba(38, 38, 38, 1)' : 'transparent', color: 'white', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50px', fontFamily: "'Gravesend Sans', sans-serif" }}>Lumière</button>
            <button onClick={() => setActiveLumiere('univers')} style={{ flex: '1', padding: '12px 25px', border: 'none', backgroundColor: activeLumiere === 'univers' ? 'rgba(38, 38, 38, 1)' : 'transparent', color: 'white', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50px', fontFamily: "'Gravesend Sans', sans-serif" }}>Univers Connecté</button>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', display: 'flex', gap: '40px', alignItems: 'flex-end', marginBottom: '0px', justifyContent: 'center', width: '100%', paddingBottom: '0px', position: 'relative', zIndex: 10 }}>
          {/* Bloc gauche - Son */}
          <div style={{ background: '#191919', padding: '40px', borderRadius: '8px', opacity: activeLumiere === 'son' ? 1 : 0.5, width: '425px', transition: 'opacity 0.6s ease' }}>
            <h3 style={{ fontSize: '20px', fontFamily: "'Gravesend Sans', sans-serif", fontWeight: '700', color: 'white', margin: '0 0 20px 0' }}>
              {lumiereContent['son'].title}<br />
              {lumiereContent['son'].subtitle}
            </h3>
            <p style={{ fontSize: '14px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'white', margin: '0', lineHeight: '1.6' }}>
              {lumiereContent['son'].text}
            </p>
          </div>

          {/* Bloc centre - Lumière */}
          <div style={{ background: '#191919', padding: '40px', borderRadius: '8px', opacity: activeLumiere === 'lumiere' ? 1 : 0.5, width: '425px', transition: 'opacity 0.6s ease' }}>
            <h3 style={{ fontSize: '20px', fontFamily: "'Gravesend Sans', sans-serif", fontWeight: '700', color: 'white', margin: '0 0 20px 0' }}>
              {lumiereContent['lumiere'].title}<br />
              {lumiereContent['lumiere'].subtitle}
            </h3>
            <p style={{ fontSize: '14px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'white', margin: '0', lineHeight: '1.6' }}>
              {lumiereContent['lumiere'].text}
            </p>
          </div>

          {/* Bloc droite - Univers Connecté */}
          <div style={{ background: '#191919', padding: '40px', borderRadius: '8px', opacity: activeLumiere === 'univers' ? 1 : 0.5, width: '425px', transition: 'opacity 0.6s ease' }}>
            <h3 style={{ fontSize: '20px', fontFamily: "'Gravesend Sans', sans-serif", fontWeight: '700', color: 'white', margin: '0 0 20px 0' }}>
              {lumiereContent['univers'].title}<br />
              {lumiereContent['univers'].subtitle}
            </h3>
            <p style={{ fontSize: '14px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'white', margin: '0', lineHeight: '1.6' }}>
              {lumiereContent['univers'].text}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: '#191919', padding: '150px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'auto' }}>
        <div ref={neaContainerRef} style={{ textAlign: 'center', maxWidth: '900px', opacity: 0, transition: 'opacity 0.1s linear' }}>
          <h2 ref={neaTitleRef} style={{ fontSize: '237.92px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'white', margin: '0', letterSpacing: '-2px', lineHeight: '1' }}>
            NEA
          </h2>
          <div ref={neaTextRef}>
            <p style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'white', margin: '0', lineHeight: '1' }}>
              Le cœur bienveillant de votre maison,
            </p>
            <p style={{ fontSize: '36px', fontFamily: "'Gravesend Sans', sans-serif", fontWeight: '700', color: 'white', margin: '0', lineHeight: '1' }}>
              propulsé par Good Waves
            </p>
          </div>
        </div>
      </section>

      <div ref={sphereRef}>
        {renderParticleSphere && (
          <Suspense fallback={<div style={{ height: '600px' }} />}>
            <ParticleSphere />
          </Suspense>
        )}
        {!renderParticleSphere && <div style={{ height: '600px', background: '#191919' }} />}
      </div>

      <section ref={connectSectionRef} style={{ background: '#191919', padding: '100px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '80%', maxWidth: '1400px', display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '100px', alignItems: 'flex-start' }}>
          {/* Left Column - Fixed */}
          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '48px', fontFamily: "'Gravesend Sans', sans-serif", fontWeight: '300', color: 'white', margin: '0', lineHeight: '1.2', letterSpacing: '-1px' }}>
              ENTREZ DANS LE MONDE <br />
              <span style={{ fontWeight: '700' }}>DE NEA CONNECT</span>
            </h2>
            <p style={{ fontSize: '18px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: 'rgba(255, 255, 255, 0.8)', margin: '30px 0 50px 0', lineHeight: '1.6' }}>
              Laissez l'intelligence invisible sublimer votre espace
            </p>
            <button style={{ background: 'transparent', border: '1.5px solid white', color: 'white', padding: '14px 45px', fontSize: '13px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '3px', transition: 'all 0.4s ease', fontFamily: "'Gravesend Sans', sans-serif" }} onMouseEnter={(e) => { e.target.style.background = 'white'; e.target.style.color = '#191919'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'white'; }}>
              Découvrir NEA
            </button>
          </div>

          {/* Right Column - Scrolling with bold effect */}
          <div ref={rightTextRef} style={{ transition: 'transform 0.1s linear' }}>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Imaginez une présence</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>discrète et attentionnée</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>qui veille sur votre maison</p>

            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>NEA est cette intelligence</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>bienveillante,</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>propulsée par Good Waves,</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>qui pense et agit pour vous.</p>

            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Tel un gardien invisible,</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>NEA assure votre confort,</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>votre sécurité et</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>l'harmonie de votre habitat.</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Tandis que Good Waves insuffle</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>la technologie et</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>la puissance à cette vision,</p>

            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>NEA en est l'âme,</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>orchestrant chaque détail</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0 0 6px 0', textTransform: 'uppercase' }}>pour que votre quotidien</p>
            <p data-fade="true" style={{ fontSize: '36px', fontFamily: "'Gravesend Sans Light', sans-serif", fontWeight: '300', color: '#8D8D8D', lineHeight: '1.3', margin: '0', textTransform: 'uppercase' }}>soit une expérience d'exception.</p>
          </div>
        </div>
      </section>

      <section style={{ background: '#191919', padding: '0', margin: '150px 0 0 0', width: '100%' }}>
        <img src="/img/Section complète.webp" alt="Section complète" width="1920" height="600" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
      </section>

      <section className="testimonial" style={{ minHeight: '40vh' }}>
        <div className="testimonial-content">
          <p className="testimonial-quote">
            <span className="quote-light">L'invisible n'est pas seulement un concept,</span><br />
            <span className="quote-bold">c'est une promesse.</span>
          </p>
          <p className="testimonial-author">
            Sébastien Pêtre, Co-fondateur
          </p>
          <a href="#interview" className="testimonial-link">
            Lire l'interview
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="link-arrow">
              <path d="M1 8H15M15 8L8 1M15 8L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      <section className="secrets-section" style={{ padding: '40px 100px' }}>
        <div className="secrets-container" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          <div className="secrets-image">
            <img src="/img/Image Integration.webp" alt="Integration Section" width="425" height="380" loading="lazy" />
          </div>
          <div className="secrets-text">
            <h2 className="secrets-title">
              <span className="secrets-light">L'art de l'intégration</span><br />
              <span className="secrets-bold">pour une expérience complète</span>
            </h2>
            <p className="secrets-description">
              Chaque technologie que nous intégrons se fait oublier pour ne laisser place qu'à la sensation pure, où le confort et l'esthétique se rejoignent dans une harmonie parfaite.
            </p>
          </div>
        </div>
      </section>

      <div ref={chatbotRef}>
        {renderChatbotSphere && (
          <Suspense fallback={null}>
            <ChatbotSphere />
          </Suspense>
        )}
      </div>
    </div>
  )
}
