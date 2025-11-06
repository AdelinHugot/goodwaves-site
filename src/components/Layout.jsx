import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      {!isHome && <Header />}
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
