import { AlertTriangle } from 'lucide-react';

function EmptyQrState({ status }) {
  const Icon = status.icon || AlertTriangle;

  const iconClassName =
    status.tone === 'warning'
      ? 'bg-yellow-400/10 text-yellow-300'
      : 'bg-red-400/10 text-red-300';

  return (
    <div className="flex aspect-square flex-col items-center justify-center rounded-2xl px-6 text-center">
      <div
        className={`mb-4 flex size-16 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        <Icon className="size-8" />
      </div>

      <p className="text-base font-bold text-(--text-primary)">
        {status.title}
      </p>

      <p className="mt-2 max-w-[280px] text-sm leading-6 text-(--text-primary)/55">
        {status.description}
      </p>
    </div>
  );
}

export default EmptyQrState;
