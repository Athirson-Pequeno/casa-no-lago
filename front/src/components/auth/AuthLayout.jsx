import { Link } from 'react-router-dom';

export function AuthLayout({ eyebrow, title, description, footerText, footerLink, footerLabel, children }) {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
        </div>

        <div className="auth-card">
          {children}
          <p className="auth-footer">
            {footerText} <Link to={footerLink}>{footerLabel}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
