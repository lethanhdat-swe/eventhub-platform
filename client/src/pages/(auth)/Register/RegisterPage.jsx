import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { isAdminUser } from '@/lib/auth/authRole';
import { signInWithGoogle } from '@/lib/firebase/googleAuth';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { validateRegisterForm } from '@/utils/registerValidation';
import { mapRegisterError } from '@/utils/registerErrorMapper';
import { mapGoogleRegisterError } from '@/utils/googleRegisterErrorMapper';
import RegisterSuccess from './components/RegisterSuccess/RegisterSuccess';
import RegisterForm from './components/RegisterForm/RegisterForm';

function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));

    setApiError('');
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateRegisterForm(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng ký.');
      return;
    }

    try {
      setLoading(true);

      await authService.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        password: form.password,
      });

      toast.success(
        'Đăng ký thành công. Vui lòng xác thực email.'
      );

      setSubmitted(true);
    } catch (error) {
      const message = mapRegisterError(error);

      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    try {
      setGoogleLoading(true);

      const { idToken } = await signInWithGoogle();

      const body = await authService.googleLogin({ idToken });

      const data = getApiData(body);

      setAuth(data);

      navigate(
        isAdminUser(data.user)
          ? '/admin/dashboard'
          : '/',
        { replace: true }
      );
    } catch (error) {
      const message = mapGoogleRegisterError(error);

      setApiError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  }

  if (submitted) {
    return <RegisterSuccess />;
  }

  return (
    <RegisterForm
      form={form}
      errors={errors}
      apiError={apiError}
      loading={loading}
      googleLoading={googleLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onGoogleRegister={handleGoogleRegister}
    />
  );
}

export default RegisterPage;