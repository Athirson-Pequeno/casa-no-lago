import { useState } from 'react';
import { registerRequest } from '../../services/auth';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
  telefone: '',
  cpf: '',
};

export function RegisterForm({ onSuccess }) {
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
      await registerRequest(values);
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
        <span>Nome</span>
        <input name="name" value={values.name} onChange={handleChange} required />
      </label>

      <label className="auth-field">
        <span>E-mail</span>
        <input name="email" type="email" value={values.email} onChange={handleChange} required />
      </label>

      <label className="auth-field">
        <span>Senha</span>
        <input name="password" type="password" value={values.password} onChange={handleChange} required />
      </label>

      <label className="auth-field">
        <span>Confirmar senha</span>
        <input
          name="confirmpassword"
          type="password"
          value={values.confirmpassword}
          onChange={handleChange}
          required
        />
      </label>

      <label className="auth-field">
        <span>Telefone</span>
        <input name="telefone" value={values.telefone} onChange={handleChange} required />
      </label>

      <label className="auth-field">
        <span>CPF</span>
        <input name="cpf" value={values.cpf} onChange={handleChange} required />
      </label>

      {error ? <p className="auth-error">{error}</p> : null}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Criando...' : 'Criar conta'}
      </button>
    </form>
  );
}
