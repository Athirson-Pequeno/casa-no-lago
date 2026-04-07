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
        <input name="email" type="email" value={values.email} onChange={handleChange} required />
      </label>

      <label className="auth-field">
        <span>Senha</span>
        <input name="password" type="password" value={values.password} onChange={handleChange} required />
      </label>

      {error ? <p className="auth-error">{error}</p> : null}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
