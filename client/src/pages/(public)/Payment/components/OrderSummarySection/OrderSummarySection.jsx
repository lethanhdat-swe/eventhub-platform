import { images } from '@/assets';
import { ReceiptText } from 'lucide-react';
import TicketTable from './components/TicketTable/TicketTable';
import EventInfoCard from './components/EventInfoCard/EventInfoCard';
import { resolvePublicAssetUrl } from '@/lib/url/resolvePublicAssetUrl';

function OrderSummarySection({ event, ticketItems = [] }) {
  const imageUrl = resolvePublicAssetUrl(event?.thumbnailUrl) || images.home;

  return (
    <section>
      <div className="flex items-center gap-2 mt-6 mb-3">
        <ReceiptText color="var(--primary-color)" size={20} />
        <p className="font-medium text-(--text-primary)">Chi tiết sự kiện</p>
      </div>

      <div className="rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-4 sm:p-5 md:grid md:grid-cols-12 md:gap-5 md:space-y-0 lg:gap-6">
        <div className="mb-4 md:col-span-4 md:mb-0 lg:col-span-3">
          <div className="w-full overflow-hidden aspect-video rounded-2xl sm:aspect-5/4 md:aspect-4/3 lg:aspect-3/4">
            <img
              src={imageUrl}
              alt={event?.title ?? 'Sự kiện'}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="space-y-4 md:col-span-8 lg:col-span-9">
          <EventInfoCard event={event} />
          <TicketTable items={ticketItems} />
        </div>
      </div>
    </section>
  );
}

export default OrderSummarySection;
