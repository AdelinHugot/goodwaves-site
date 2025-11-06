import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Goodwaves</h3>
            <p>Votre compagnon de surf idéal.</p>
          </div>
          <div className="footer-section">
            <h4>Liens rapides</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/about">À Propos</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Réseaux sociaux</h4>
            <ul>
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#twitter">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Goodwaves. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
