import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function VerifyEmailStatusCard({
  icon,
  title,
  description,
  countdown,
  footer,
}) {
  return (
    <div className="w-full max-w-110">
      <Card className="rounded-3xl border border-(--border-color) bg-(--card-surface-color) shadow-[0_20px_70px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <CardHeader className="pt-8 pb-4 text-center px-7">
          {icon}

          <CardTitle className="text-2xl font-black text-(--text-primary)">
            {title}
          </CardTitle>

          <CardDescription className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--muted-text)">
            {description}
          </CardDescription>
        </CardHeader>

        {countdown}

        <CardFooter className="flex flex-col gap-3 border-t border-(--border-color) bg-(--soft-surface-color) px-7 py-6">
          {footer}
        </CardFooter>
      </Card>
    </div>
  );
}