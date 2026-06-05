import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { isAdminUser } from '@/lib/auth/authRole';
import { getErrorMessage } from '@/lib/http/apiError';
import { getApiData } from '@/lib/http/unwrapApiSuccess';
import { authService } from '@/lib/services/auth';
import { useAuthStore } from '@/stores/authStore';
import VerifyEmailStatusCard from './components/VerifyEmailStatusCard/VerifyEmailStatusCard';
import { getStatusConfig } from './components/statusConfig';
import StatusIcon from './components/StatusIcon/StatusIcon';
import VerifyEmailCountdown from './components/VerifyEmailCountdown/VerifyEmailCountdown';
import VerifyEmailActions from './components/VerifyEmailActions/VerifyEmailActions';

function VerifyEmailPage() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const navigate = useNavigate();

  const [params] = useSearchParams();

  const token = params.get('token') ?? '';

  const [status, setStatus] = useState(
    () => (!token ? 'failed' : 'loading')
  );

  const [errorDetail, setErrorDetail] = useState('');

  const [verifiedAuthData, setVerifiedAuthData] =
    useState(null);

  const [countdown, setCountdown] = useState(3);

  const verifyRequestSeq = useRef(0);

  useEffect(() => {
    if (!token) return;

    const storageKey = `eventhub_verify_email_${token}`;

    const currentStatus =
      sessionStorage.getItem(storageKey);

    if (
      currentStatus === 'pending' ||
      currentStatus === 'success'
    ) {
      return;
    }

    sessionStorage.setItem(storageKey, 'pending');

    const seq = ++verifyRequestSeq.current;

    (async () => {
      try {
        const body = await authService.verifyEmail({
          token,
        });

        if (seq !== verifyRequestSeq.current) return;

        const data = getApiData(body);

        setVerifiedAuthData(data);
        setStatus('success');

        sessionStorage.setItem(storageKey, 'success');
      } catch (e) {
        if (seq !== verifyRequestSeq.current) return;

        setErrorDetail(getErrorMessage(e));
        setStatus('failed');

        sessionStorage.removeItem(storageKey);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (
      status !== 'success' ||
      !verifiedAuthData
    ) {
      return;
    }

    setCountdown(3);

    const destination = isAdminUser(
      verifiedAuthData.user
    )
      ? '/admin/dashboard'
      : '/';

    const intervalId = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);

          setAuth(verifiedAuthData);

          navigate(destination, {
            replace: true,
          });

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    navigate,
    setAuth,
    status,
    verifiedAuthData,
  ]);

  function handleNavigateNow() {
    if (!verifiedAuthData) return;

    const destination = isAdminUser(
      verifiedAuthData.user
    )
      ? '/admin/dashboard'
      : '/';

    setAuth(verifiedAuthData);

    navigate(destination, {
      replace: true,
    });
  }

  const isAdmin = isAdminUser(
    verifiedAuthData?.user
  );

  const config = getStatusConfig(
    status,
    token,
    errorDetail
  );

  return (
    <VerifyEmailStatusCard
      icon={<StatusIcon status={status} />}
      title={config.title}
      description={config.description}
      countdown={
        status === 'success' ? (
          <VerifyEmailCountdown
            countdown={countdown}
            isAdmin={isAdmin}
          />
        ) : null
      }
      footer={
        <VerifyEmailActions
          status={status}
          isAdmin={isAdmin}
          onNavigateNow={handleNavigateNow}
        />
      }
    />
  );
}

export default VerifyEmailPage;