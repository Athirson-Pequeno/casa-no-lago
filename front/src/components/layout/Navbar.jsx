import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { isAdmin, isAuthenticated, logout, name } = useAuth();
  const firstName = (name || '').trim().split(/\s+/)[0];

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" to="/">
          Casa do <span>Lago</span>
        </Link>

        <nav className="site-nav" aria-label="Principal">
          <a href="#quartos">Quartos</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="site-nav__actions">
          {isAuthenticated && firstName ? (
            <span className="site-nav__greeting">Ola, {firstName}</span>
          ) : null}

          {isAuthenticated && isAdmin ? (
            <Link className="site-nav__button" to="/admin/quartos">
              Admin
            </Link>
          ) : null}

          {isAuthenticated ? (
            <button className="site-nav__button" type="button" onClick={logout}>
              Sair
            </button>
          ) : (
            <Link className="site-nav__button site-nav__button--primary" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
