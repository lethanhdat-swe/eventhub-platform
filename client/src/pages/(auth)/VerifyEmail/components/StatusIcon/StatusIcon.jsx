import {
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function StatusIcon({ status }) {
  if (status === 'loading') {
    return (
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--primary-color)/10 text-(--primary-color)">
        <Loader2
          aria-hidden
          className="size-8 animate-spin"
        />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center mx-auto mb-5 h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500">
        <CheckCircle2
          aria-hidden
          className="size-8"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mx-auto mb-5 text-red-500 h-14 w-14 rounded-2xl bg-red-500/10">
      <AlertCircle
        aria-hidden
        className="size-8"
      />
    </div>
  );
}