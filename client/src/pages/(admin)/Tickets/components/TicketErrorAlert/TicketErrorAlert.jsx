import { AdminErrorState } from '@/pages/(admin)/components/table';

function TicketErrorAlert({ error, hasData, onRetry }) {
  if (!error || !hasData) return null;

  return <AdminErrorState message={error} onRetry={onRetry} />;
}

export default TicketErrorAlert;
