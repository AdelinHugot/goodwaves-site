import './About.css'

export default function About() {
  return (
    <div className="about">
      <div className="container">
        <h1>À Propos de Goodwaves</h1>

        <section className="about-section">
          <h2>Notre Mission</h2>
          <p>
            Goodwaves a pour mission de rendre le surf plus accessible et agréable pour tous les
            passionnés, du débutant au professionnel. Nous croyons que la technologie peut améliorer
            l'expérience de surf en fournissant des informations précises sur les conditions des vagues.
          </p>
        </section>

        <section className="about-section">
          <h2>Notre Histoire</h2>
          <p>
            Fondée en 2024, Goodwaves est née de la passion de surfeurs qui souhaitaient une meilleure
            façon d'accéder aux prévisions de surf. Ce qui a commencé comme un projet personnel s'est
            transformé en une plateforme complète dédiée à la communauté du surf.
          </p>
        </section>

        <section className="about-section">
          <h2>Nos Valeurs</h2>
          <ul className="values-list">
            <li>Transparence et honnêteté</li>
            <li>Innovation et excellence</li>
            <li>Respect de l'environnement et des océans</li>
            <li>Soutien à la communauté du surf</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>L'Équipe</h2>
          <p>
            Nous sommes une équipe de développeurs passionnés, de data scientists et de surfeurs
            qui travaillent ensemble pour créer la meilleure expérience possible pour nos utilisateurs.
          </p>
        </section>
      </div>
    </div>
  )
}
