export default function TicketTypeLegend({ ticketTypes = [] }) {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2 px-4">
      {ticketTypes.map((t) => (
        <span
          key={t.id}
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600"
        >
          <span
            className="size-2.5 shrink-0 rounded-sm border border-black/5"
            style={{ backgroundColor: t.color || '#CBD5E1' }}
            aria-hidden
          />
          {t.name}
        </span>
      ))}
    </div>
  );
}
