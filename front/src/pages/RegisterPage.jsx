import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      eyebrow="Nova jornada"
      title="Criar conta"
      description="Crie seu acesso para reservar quartos, guardar seus dados e voltar sempre que quiser."
      footerText="Ja tem uma conta?"
      footerLink="/login"
      footerLabel="Entrar"
    >
      <RegisterForm onSuccess={() => navigate('/login', { replace: true })} />
    </AuthLayout>
  );
}
