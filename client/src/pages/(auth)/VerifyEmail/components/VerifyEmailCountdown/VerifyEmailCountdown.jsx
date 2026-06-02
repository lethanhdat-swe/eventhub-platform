import { CardContent } from '@/components/ui/card';

export default function VerifyEmailCountdown({
  countdown,
  isAdmin,
}) {
  return (
    <CardContent className="pb-4 px-7">
      <div className="rounded-2xl border border-(--border-color) bg-(--soft-surface-color) px-4 py-3 text-center text-xs leading-relaxed text-(--muted-text)">
        {isAdmin
          ? `Tự chuyển tới bảng điều khiển sau ${countdown} giây.`
          : `Tự chuyển về trang chủ sau ${countdown} giây.`}
      </div>
    </CardContent>
  );
}