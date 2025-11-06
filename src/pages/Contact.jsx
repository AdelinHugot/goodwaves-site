import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="contact">
      <div className="container">
        <h1>Contactez-Nous</h1>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Nous aimerions vous entendre</h2>
            <p>
              Des questions ? Des suggestions ? N'hésitez pas à nous contacter. Notre équipe
              vous répondra dès que possible.
            </p>

            <div className="info-items">
              <div className="info-item">
                <h3>Email</h3>
                <p><a href="mailto:hello@goodwaves.com">hello@goodwaves.com</a></p>
              </div>
              <div className="info-item">
                <h3>Téléphone</h3>
                <p><a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
              </div>
              <div className="info-item">
                <h3>Localisation</h3>
                <p>France</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="success-message">
                ✓ Message envoyé avec succès ! Merci de nous avoir contacté.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Envoyer le Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
