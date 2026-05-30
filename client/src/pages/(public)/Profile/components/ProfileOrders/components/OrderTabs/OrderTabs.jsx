import { Bookmark, Ticket } from 'lucide-react';
import { useState } from 'react';
import SavedEvents from '../SavedEvents/SavedEvents';
import TicketOrder from '../TicketOrder/TicketOrder';

function OrderTabs() {
  const [activeTab, setActiveTab] = useState('ticket');

  const tabs = [
    { label: 'Vé', value: 'ticket', Icon: Ticket },
    { label: 'Sự kiện đã lưu', value: 'saved-events', Icon: Bookmark },
  ];

  return (
    <section className="space-y-6">
      <div className="pt-2">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--primary-color)]">
              Quản lý của bạn
            </p>

            <h2 className="max-w-[320px] text-xl font-black leading-tight tracking-[-0.035em] text-[var(--text-primary)] sm:max-w-none sm:text-2xl">
              Danh sách vé và sự kiện đã lưu
            </h2>
          </div>
        </div>

        <div
          className="
            grid w-full grid-cols-2 rounded-full
            border border-[var(--border-color)]
            bg-[var(--card-surface-color)]
            p-1
            shadow-[0_16px_45px_rgba(0,0,0,0.18)]
            backdrop-blur-xl
            sm:inline-flex sm:w-auto
          "
        >
          {tabs.map(({ label, value, Icon }) => {
            const isActive = activeTab === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`
                  inline-flex cursor-pointer items-center justify-center gap-2
                  rounded-full px-3 py-2.5
                  text-xs font-black
                  transition-all duration-300
                  active:scale-95
                  sm:px-5 sm:text-sm
                  ${
                    isActive
                      ? 'bg-[var(--primary-color)] text-white shadow-[0_12px_35px_rgba(124,58,237,0.35)]'
                      : 'text-[var(--muted-text)] hover:bg-[var(--soft-surface-color)] hover:text-[var(--text-primary)]'
                  }
                `}
              >
                <Icon size={14} />
                <span className="truncate">{label}</span>
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
