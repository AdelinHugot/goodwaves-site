import { useRef } from 'react'
import './FeaturesWithLines.css'

export default function FeaturesWithLines() {
  const containerRef = useRef(null)

  const features = [
    {
      title: 'PRÉSENCE INTELLIGENTE',
      subtitle: 'Veille Silencieuse'
    },
    {
      title: 'PROTECTION INVISIBLE',
      subtitle: 'Sécurité Discrète'
    },
    {
      title: 'CONTRÔLE ADAPTATIF',
      subtitle: 'Réaction instantanée'
    },
    {
      title: 'ANTICIPATION CONTINUE',
      subtitle: 'Prévoyance dynamique'
    }
  ]

  return (
    <div className="features-with-lines-container" ref={containerRef}>
      <div className="features-content">
        {/* Left features */}
        <div className="features-column left">
          <div className="feature-block">
            <h3 className="feature-title">{features[0].title}</h3>
            <p className="feature-subtitle">{features[0].subtitle}</p>
            <svg className="feature-line" viewBox="0 0 200 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
              <circle cx="0" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)"/>
            </svg>
          </div>

          <div className="feature-block">
            <h3 className="feature-title">{features[1].title}</h3>
            <p className="feature-subtitle">{features[1].subtitle}</p>
            <svg className="feature-line" viewBox="0 0 200 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
              <circle cx="0" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)"/>
            </svg>
          </div>
        </div>

        {/* Center sphere */}
        <div className="features-center">
          <svg className="center-sphere" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2"/>
            <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
          </svg>
        </div>

        {/* Right features */}
        <div className="features-column right">
          <div className="feature-block">
            <svg className="feature-line" viewBox="0 0 200 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
              <circle cx="200" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)"/>
            </svg>
            <h3 className="feature-title">{features[2].title}</h3>
            <p className="feature-subtitle">{features[2].subtitle}</p>
          </div>

          <div className="feature-block">
            <svg className="feature-line" viewBox="0 0 200 100" preserveAspectRatio="none">
              <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.5"/>
              <circle cx="200" cy="50" r="3" fill="rgba(255, 255, 255, 0.6)"/>
            </svg>
            <h3 className="feature-title">{features[3].title}</h3>
            <p className="feature-subtitle">{features[3].subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
