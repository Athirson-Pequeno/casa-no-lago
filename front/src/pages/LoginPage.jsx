import { Navigate, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { hasValidStoredSession, useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated || hasValidStoredSession()) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout
      eyebrow="Hospedagem editorial"
      title="Entrar"
      description="Acesse sua conta para acompanhar reservas e preparar a chegada com calma."
      footerText="Ainda nao tem cadastro?"
      footerLink="/cadastro"
      footerLabel="Criar conta"
    >
      <LoginForm onSuccess={() => navigate('/', { replace: true })} />
    </AuthLayout>
  );
}
