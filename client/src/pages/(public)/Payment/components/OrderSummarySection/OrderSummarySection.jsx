import { images } from '@/assets';
import { ReceiptText } from 'lucide-react';
import TicketTable from './components/TicketTable/TicketTable';
import EventInfoCard from './components/EventInfoCard/EventInfoCard';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function OrderSummarySection({ event, ticketItems = [] }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;

  return (
    <div>
      <div className="flex items-center gap-2 mt-6 mb-3">
        <ReceiptText color="var(--primary-color)" size={20} />
        <p className="text-(--text-primary) font-medium">Chi tiết sự kiện</p>
      </div>

      <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-4 sm:p-5 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-5">
        <div className="md:col-span-4">
          <div className="aspect-[16/9] sm:aspect-[5/4] md:aspect-[5/5] w-full overflow-hidden rounded-2xl">
            <img
              src={imageUrl}
              alt={event?.title ?? 'Event'}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="space-y-4 md:col-span-8">
          <EventInfoCard event={event} />
          <TicketTable items={ticketItems} />
        </div>
      </div>
    </div>
  );
}

export default OrderSummarySection;