import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { authService } from '@/lib/services/auth';
import { getErrorMessage } from '@/lib/http/apiError';
import ResetPasswordStatusCard from './components/ResetPasswordStatusCard/ResetPasswordStatusCard';
import ResetPasswordActions from './components/ResetPasswordActions/ResetPasswordActions';
import ResetPasswordForm from './components/ResetPasswordForm/ResetPasswordForm';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();

  const token = params.get('token') ?? '';

  const [phase, setPhase] = useState(
    token ? 'loading' : 'missing'
  );

  const [invalidDetail, setInvalidDetail] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const verifySeq = useRef(0);

  useEffect(() => {
    if (!token) return;

    const seq = ++verifySeq.current;

    (async () => {
      try {
        await authService.verifyResetToken({ token });

        if (seq !== verifySeq.current) return;

        setPhase('form');
      } catch (e) {
        if (seq !== verifySeq.current) return;

        setInvalidDetail(getErrorMessage(e));
        setPhase('invalid');
      }
    })();
  }, [token]);

  function validateForm() {
    const next = {
      password: '',
      confirmPassword: '',
    };

    if (password.length < 6) {
      next.password = 'Mật khẩu cần ít nhất 6 ký tự';
    }

    if (password !== confirmPassword) {
      next.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(next);

    return !next.password && !next.confirmPassword;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await authService.resetPassword({
        token,
        password,
      });

      setPhase('success');
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  if (phase === 'missing') {
    return (
      <ResetPasswordStatusCard
        title="Thiếu liên kết"
        description="Đường dẫn đặt lại mật khẩu không hợp lệ. Hãy dùng liên kết đầy đủ được gửi qua email."
        icon={
          <div className="flex items-center justify-center mx-auto mb-5 h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-500">
            <AlertTriangle className="size-8" />
          </div>
        }
        actions={<ResetPasswordActions />}
      />
    );
  }

  if (phase === 'loading') {
    return (
      <ResetPasswordStatusCard
        title="Đang kiểm tra"
        description="Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra liên kết đặt lại mật khẩu của bạn."
        icon={
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
            <Loader2 className="size-8 animate-spin" />
          </div>
        }
      />
    );
  }

  if (phase === 'invalid') {
    return (
      <ResetPasswordStatusCard
        title="Liên kết không hợp lệ"
        description={
          invalidDetail ||
          'Liên kết đặt lại mật khẩu đã hết hạn hoặc không còn hiệu lực.'
        }
        icon={
          <div className="flex items-center justify-center mx-auto mb-5 text-red-500 h-14 w-14 rounded-2xl bg-red-500/10">
            <AlertTriangle className="size-8" />
          </div>
        }
        actions={<ResetPasswordActions />}
      />
    );
  }

  if (phase === 'success') {
    return (
      <ResetPasswordStatusCard
        title="Đổi mật khẩu thành công"
        description="Bạn có thể đăng nhập lại bằng mật khẩu mới vừa tạo."
        icon={
          <div className="flex items-center justify-center mx-auto mb-5 h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-8" />
          </div>
        }
        actions={
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-(--primary-color) text-sm font-bold text-white"
          >
            Đăng nhập với mật khẩu mới
          </Link>
        }
      />
    );
  }

  return (
    <ResetPasswordForm
      password={password}
      confirmPassword={confirmPassword}
      errors={errors}
      loading={loading}
      submitError={submitError}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
      onSubmit={handleSubmit}
    />
  );
}