import CheckoutButton from './components/CheckoutButton/CheckoutButton';
import OrderPreviewCard from './components/OrderPreviewCard/OrderPreviewCard';
import SelectedTicketsList from './components/SelectedTicketsList/SelectedTicketsList';

function OrderSummarySection({
  event,
  selectedSeats = [],
  selectedSeatIds = [],
  customerInfo,
}) {
  return (
    <section className="rounded-[24px] border border-(--text-primary)/10 bg-(--card-surface-color)/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-5 md:p-6 lg:p-7">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-(--text-primary)/10 pb-4">
        <p className="text-base font-bold uppercase tracking-[0.08em] text-(--text-primary) md:text-lg">
          Tóm tắt đơn hàng
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <OrderPreviewCard event={event} />
          <SelectedTicketsList selectedSeats={selectedSeats} />
        </div>

        <CheckoutButton
          event={event}
          selectedSeats={selectedSeats}
          selectedSeatIds={selectedSeatIds}
          customerInfo={customerInfo}
        />
      </div>
    </section>
  );
}

export default OrderSummarySection;
