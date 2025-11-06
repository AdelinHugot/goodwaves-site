import { useState } from 'react'
import './HeroNavbar.css'

export default function HeroNavbar() {
  const [activeTab, setActiveTab] = useState('particulier')

  return (
    <nav className="hero-navbar-wrapper">
      <div className="hero-navbar-content">
        <div className="hero-navbar-logo">
          <img src="/img/Logo Goodawaves.webp" alt="Goodwaves Logo" width="50" height="50" />
        </div>

        <div className="hero-navbar-pill">
          <button
            className={`navbar-pill-tab ${activeTab === 'particulier' ? 'active' : ''}`}
            onClick={() => setActiveTab('particulier')}
          >
            ESPACE PARTICULIER
          </button>
          <button
            className={`navbar-pill-tab ${activeTab === 'pro' ? 'active' : ''}`}
            onClick={() => setActiveTab('pro')}
          >
            ESPACE PRO
          </button>
        </div>

        <div className="hero-navbar-right">
          <span className="hero-navbar-number">0001</span>
          <svg width="42" height="8" viewBox="0 0 42 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-navbar-menu">
            <path d="M21 0C21.5523 0 22 0.447715 22 1C22 1.55228 21.5523 2 21 2H1C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0H21Z" fill="white"/>
            <path d="M41 6C41.5523 6 42 6.44772 42 7C42 7.55228 41.5523 8 41 8H1C0.447715 8 0 7.55228 0 7C0 6.44772 0.447715 6 1 6H41Z" fill="white"/>
          </svg>
        </div>
      </div>
    </nav>
  )
}
