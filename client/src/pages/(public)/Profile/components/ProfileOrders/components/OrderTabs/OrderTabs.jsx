import { ArrowRight, Bookmark, Ticket } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TicketOrder from '../TicketOrder/TicketOrder';
import SavedEvents from '../SavedEvents/SavedEvents';

function OrderTabs() {
  const [activeTab, setActiveTab] = useState('ticket');

  const tabs = [
    { label: 'Vé', value: 'ticket', Icon: Ticket },
    { label: 'Sự kiện đã lưu', value: 'saved-events', Icon: Bookmark },
  ];

  const viewAllConfig =
    activeTab === 'ticket'
      ? { label: 'Xem tất cả vé', to: '/myorder' }
      : { label: 'Xem sự kiện đã lưu', to: '/saved-events' };

  return (
    <section className="space-y-6">
      <div className="pt-2">
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end sm:justify-between sm:flex-wrap">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--primary-color)]">
              Quản lý của bạn
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-[-0.035em] text-[var(--text-primary)]">
              Danh sách vé và sự kiện đã lưu
            </h2>
          </div>

          <Link
            to={viewAllConfig.to}
            className="
              self-start sm:self-auto
              group inline-flex items-center gap-2 rounded-full
              border border-[var(--border-color)]
              bg-[var(--soft-surface-color)] px-4 sm:px-5 py-2.5 sm:py-3
              text-sm font-black text-[var(--primary-color)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:border-[var(--primary-color)]/55
              hover:bg-[var(--primary-color)]
              hover:text-white
              active:scale-95
            "
          >
            {viewAllConfig.label}
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="inline-flex rounded-full border border-[var(--border-color)] bg-[var(--card-surface-color)] p-1 shadow-[0_16px_45px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          {tabs.map(({ label, value, Icon }) => {
            const isActive = activeTab === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`
                  cursor-pointer inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5
                  text-xs sm:text-sm font-black transition-all duration-300 active:scale-95
                  ${isActive
                    ? 'bg-[var(--primary-color)] text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)]'
                    : 'text-[var(--muted-text)] hover:bg-[var(--soft-surface-color)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>{activeTab === 'ticket' ? <TicketOrder /> : <SavedEvents />}</div>
    </section>
  );
}

export default OrderTabs;