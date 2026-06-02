import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { isAdminUser } from '@/lib/auth/authRole';
import { useAuthStore } from '@/stores/authStore';
import { useLogin } from '@/hooks/useLogin';
import { validateLoginForm } from '@/utils/loginValidation';
import LoginHeader from './components/LoginHeader/LoginHeader';
import LoginErrorAlert from './components/LoginErrorAlert/LoginErrorAlert';
import LoginForm from './components/LoginForm/LoginForm';
import SocialLoginSection from './components/SocialLoginSection/SocialLoginSection';


function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const redirectAfterLogin = (data) => {
    if (isAdminUser(data.user)) {
      navigate('/admin/dashboard', {
        replace: true,
      });
      return;
    }

    navigate('/', {
      replace: true,
    });
  };

  const {
    login,
    googleLogin,
    loading,
    googleLoading,
    apiError,
    setApiError,
  } = useLogin(setAuth, redirectAfterLogin);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(
      email,
      password
    );

    setErrors(validationErrors);

    if (
      validationErrors.email ||
      validationErrors.password
    ) {
      return;
    }

    await login({
      email: email.trim(),
      password,
    });
  };

  return (
    <div className="w-full max-w-130">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="pb-3 text-center px-7 pt-7">
          <LoginHeader />
        </CardHeader>

        <CardContent className="space-y-5 px-7 pb-7">
          <LoginErrorAlert message={apiError} />

          <LoginForm
            email={email}
            password={password}
            errors={errors}
            loading={loading}
            googleLoading={googleLoading}
            onSubmit={handleSubmit}
            onEmailChange={(value) => {
              setEmail(value);
              setApiError('');

              setErrors((prev) => ({
                ...prev,
                email: '',
              }));
            }}
            onPasswordChange={(value) => {
              setPassword(value);
              setApiError('');

              setErrors((prev) => ({
                ...prev,
                password: '',
              }));
            }}
          />

          <SocialLoginSection
            loading={googleLoading}
            disabled={loading}
            onGoogleLogin={googleLogin}
          />

        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;