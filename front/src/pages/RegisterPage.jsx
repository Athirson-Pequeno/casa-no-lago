import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import { hasValidStoredSession, useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated || hasValidStoredSession()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      title="Criar conta"
      description="Preencha seus dados para reservar quartos e acompanhar sua estadia."
      footerText="Ja tem uma conta?"
      footerLink="/login"
      footerLabel="Entrar"
      quote="Casa do Lago — sua estadia a beira d'agua"
    >
      <RegisterForm onSuccess={() => navigate('/login', { replace: true })} />
    </AuthLayout>
  );
}
