function BookingGuideStep({ step, stepNumber, isLast }) {
  const description =
    typeof step.description === 'string' ? step.description.trim() : '';

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast ? (
        <span
          className="absolute top-6 bottom-0 left-[11px] w-0.5 bg-(--primary-color)/25"
          aria-hidden
        />
      ) : null}
      <span
        className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-(--primary-color)/20 text-xs font-bold text-(--primary-color)"
        aria-hidden
      >
        {stepNumber}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-(--text-primary)">
          {step.title}
        </p>
        {description ? (
          <p className="mt-1 wrap-break-word text-sm leading-relaxed text-(--text-primary)/80">
            {description}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function BookingGuideFlow({ steps, title }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const header =
    typeof title === 'string' && title.trim().length > 0 ? title.trim() : null;

  return (
    <div className="rounded-xl border border-(--border-color)/70 bg-(--soft-surface-color) px-3 py-3">
      {header ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-(--primary-color)">
          {header}
        </p>
      ) : null}
      <ol className="max-h-64 list-none space-y-0 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]">
        {steps.map((step, index) => (
          <BookingGuideStep
            key={`${step.title}-${index}`}
            step={step}
            stepNumber={index + 1}
            isLast={index === steps.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}

export default BookingGuideFlow;
