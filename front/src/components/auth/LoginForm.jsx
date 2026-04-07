import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const initialValues = {
  email: '',
  password: '',
};

export function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(values);
      onSuccess?.();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>E-mail</span>
        <div className="auth-input-wrap">
          <input name="email" type="email" value={values.email} onChange={handleChange} required />
        </div>
      </label>

      <label className="auth-field">
        <span>Senha</span>
        <div className="auth-input-wrap">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            required
          />
          <button
            className="auth-toggle"
            type="button"
            aria-label="Mostrar senha"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      </label>

      {error ? <p className="auth-error">{error}</p> : null}

      <p className="auth-forgot">
        <a href="#">Esqueceu a senha?</a>
      </p>

      <button className={`auth-submit${isSubmitting ? ' is-loading' : ''}`} type="submit" disabled={isSubmitting}>
        <span className="auth-submit__text">{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
      </button>

      <div className="auth-divider">ou</div>
    </form>
  );
}
