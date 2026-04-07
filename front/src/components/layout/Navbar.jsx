import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-logo" to="/">
          Casa do Lago
        </Link>

        <nav className="site-nav" aria-label="Principal">
          <a href="#acomodacoes">Acomodacoes</a>
          {isAuthenticated ? (
            <button className="site-nav__button" type="button" onClick={logout}>
              Sair
            </button>
          ) : (
            <Link to="/login">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
