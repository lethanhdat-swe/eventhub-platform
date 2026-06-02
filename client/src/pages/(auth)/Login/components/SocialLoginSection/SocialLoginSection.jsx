import { Separator } from '@/components/ui/separator';
import GoogleAuthButton from '@/pages/(auth)/components/GoogleAuthButton/GoogleAuthButton';

export default function SocialLoginSection({
  loading,
  disabled,
  onGoogleLogin,
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-(--border-color)" />
        <span className="text-xs text-(--muted-text)">hoặc</span>
        <Separator className="flex-1 bg-(--border-color)" />
      </div>

      <GoogleAuthButton
        label={loading ? 'Đang đăng nhập…' : 'Tiếp tục với Google'}
        loading={loading}
        disabled={disabled}
        onClick={onGoogleLogin}
      />
    </>
  );
}