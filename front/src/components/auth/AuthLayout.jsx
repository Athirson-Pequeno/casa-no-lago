import { Link } from 'react-router-dom';

function AuthScene() {
  return (
    <svg className="auth-scene" viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8c8e8" />
          <stop offset="100%" stopColor="#d6e8d6" />
        </linearGradient>
      </defs>
      <rect width="720" height="900" fill="url(#sky)" />
      <ellipse cx="120" cy="700" rx="300" ry="180" fill="#7aaa7a" opacity=".6" />
      <ellipse cx="600" cy="720" rx="320" ry="170" fill="#6a9a6a" opacity=".6" />
      <ellipse cx="360" cy="750" rx="400" ry="160" fill="#5a8a5a" opacity=".5" />
      <rect x="0" y="680" width="720" height="220" fill="#5a9ab8" opacity=".55" />
      <rect x="0" y="710" width="720" height="190" fill="#4a8aaa" opacity=".45" />
      <line x1="60" y1="730" x2="220" y2="730" stroke="#fff" strokeWidth="1.5" opacity=".25" />
      <line x1="300" y1="745" x2="520" y2="745" stroke="#fff" strokeWidth="1.5" opacity=".25" />
      <line x1="580" y1="735" x2="700" y2="735" stroke="#fff" strokeWidth="1" opacity=".2" />
      <rect x="270" y="520" width="180" height="170" rx="4" fill="#f0e6d8" />
      <polygon points="250,528 360,440 470,528" fill="#7a5a42" />
      <rect x="285" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8" />
      <rect x="380" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8" />
      <rect x="330" y="615" width="40" height="75" rx="3" fill="#5a3a28" />
      <rect x="345" y="688" width="8" height="50" fill="#8b6a52" />
      <rect x="375" y="688" width="8" height="50" fill="#8b6a52" />
      <rect x="338" y="682" width="52" height="9" rx="2" fill="#a08060" />
      <rect x="150" y="560" width="10" height="130" fill="#4a3020" />
      <ellipse cx="155" cy="540" rx="40" ry="50" fill="#3a6a3a" />
      <ellipse cx="155" cy="518" rx="28" ry="36" fill="#4a7a4a" />
      <rect x="545" y="555" width="10" height="135" fill="#4a3020" />
      <ellipse cx="550" cy="534" rx="42" ry="52" fill="#3a6a3a" />
      <ellipse cx="550" cy="510" rx="30" ry="38" fill="#4a7a4a" />
      <ellipse cx="120" cy="120" rx="90" ry="34" fill="#fff" opacity=".5" />
      <ellipse cx="190" cy="110" rx="62" ry="27" fill="#fff" opacity=".45" />
      <ellipse cx="560" cy="100" rx="100" ry="36" fill="#fff" opacity=".45" />
      <ellipse cx="644" cy="90" rx="66" ry="28" fill="#fff" opacity=".4" />
      <circle cx="620" cy="130" r="55" fill="#f5d78e" opacity=".6" />
      <circle cx="620" cy="130" r="40" fill="#f0c860" opacity=".5" />
    </svg>
  );
}

export function AuthLayout({ title, description, footerText, footerLink, footerLabel, quote, children }) {
  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-panel-left">
          <AuthScene />
          <div className="auth-panel-left__overlay" />
          <p className="auth-panel-left__quote">{quote}</p>
        </aside>

        <section className="auth-panel-right">
          <div className="auth-form-box">
            <Link className="auth-logo" to="/">
              <div className="auth-logo__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
              </div>
              <div className="auth-logo__text">
                Casa do <span>Lago</span>
              </div>
            </Link>

            <h1>{title}</h1>
            <p className="auth-subtitle">{description}</p>

            {children}

            <p className="auth-register-row">
              {footerText} <Link to={footerLink}>{footerLabel}</Link>
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
