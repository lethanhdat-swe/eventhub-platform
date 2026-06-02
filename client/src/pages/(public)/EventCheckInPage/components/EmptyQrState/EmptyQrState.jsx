import { AlertTriangle } from 'lucide-react';

function EmptyQrState({ status }) {
  const Icon = status.icon || AlertTriangle;

  const iconClassName =
    status.tone === 'warning'
      ? 'bg-yellow-400/10 text-yellow-300'
      : 'bg-red-400/10 text-red-300';

  return (
    <div className="flex flex-col items-center justify-center px-6 text-center aspect-square rounded-2xl">
      <div
        className={`mb-4 flex size-16 items-center justify-center rounded-2xl ${iconClassName}`}
      >
        <Icon className="size-8" />
      </div>

      <p className="text-base font-bold text-(--text-primary)">
        {status.title}
      </p>

      <p className="mt-2 max-w-70 text-sm leading-6 text-(--text-primary)/55">
        {status.description}
      </p>
    </div>
  );
}

export default EmptyQrState;
