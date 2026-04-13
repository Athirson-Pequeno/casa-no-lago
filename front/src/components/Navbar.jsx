import { useNavigate, Link } from 'react-router-dom'
import { getUser, logout } from '../lib/api.js'
import styles from './Navbar.module.css'

export default function Navbar() {
  const navigate  = useNavigate()
  const { name, token } = getUser()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        Casa do <span>Lago</span>
      </Link>

      <ul className={styles.links}>
        <li><a href="#quartos">Quartos</a></li>
        <li><a href="#sobre">Sobre</a></li>
        <li><a href="#contato">Contato</a></li>
      </ul>

      <div className={styles.user}>
        {token ? (
          <>
            {name && <span className={styles.name}>Olá, {name}</span>}
            <button className={styles.btnLogout} onClick={handleLogout}>Sair</button>
          </>
        ) : (
          <Link to="/login" className={styles.btnLogin}>Login</Link>
        )}
      </div>
    </nav>
  )
}
