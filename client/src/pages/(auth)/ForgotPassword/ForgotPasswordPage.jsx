import { useState } from 'react';

import { authService } from '@/lib/services/auth';
import { isValidEmail, mapForgotPasswordError } from '@/utils/forgotPasswordUtils';
import ForgotPasswordSuccess from './components/ForgotPasswordSuccess/ForgotPasswordSuccess';
import ForgotPasswordForm from './components/ForgotPasswordForm/ForgotPasswordForm';


function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState('');
  const [apiError, setApiError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    setApiError('');

    if (!email.trim()) {
      setFieldError('Vui lòng nhập email');
      return;
    }

    if (!isValidEmail(email)) {
      setFieldError('Email không hợp lệ');
      return;
    }

    setFieldError('');
    setLoading(true);

    try {
      await authService.forgotPassword({
        email: email.trim(),
      });

      setSent(true);
    } catch (error) {
      setApiError(mapForgotPasswordError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-105">
      {sent ? (
        <ForgotPasswordSuccess email={email} />
      ) : (
        <ForgotPasswordForm
          apiError={apiError}
          email={email}
          fieldError={fieldError}
          loading={loading}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default ForgotPasswordPage;