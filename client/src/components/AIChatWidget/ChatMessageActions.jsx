import { useState } from 'react';

import RefundFormPlaceholder from './RefundFormPlaceholder';

function formatEventDate(startDate) {
  if (!startDate) return null;

  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ActionChip({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/15 ${className}`}
    >
      {children}
    </button>
  );
}

function ViewEventCard({ action }) {
  const payload = action.payload ?? {};
  const dateText = formatEventDate(payload.startDate);

  return (
    <div className="w-full max-w-[240px] overflow-hidden rounded-xl border border-(--border-color) bg-(--soft-surface-color)">
      {payload.thumbnailUrl ? (
        <img src={payload.thumbnailUrl} alt="" className="h-20 w-full object-cover" />
      ) : (
        <div className="h-20 w-full bg-(--surface-color)" />
      )}

      <div className="space-y-1 p-2.5">
        <p className="line-clamp-2 text-xs font-semibold text-(--text-primary)">{action.label}</p>
        {payload.location ? (
          <p className="line-clamp-1 text-[11px] text-(--muted-text)">{payload.location}</p>
        ) : null}
        {dateText ? <p className="text-[11px] text-(--muted-text)">{dateText}</p> : null}
        <ActionChip className="mt-1">Xem chi tiết</ActionChip>
      </div>
    </div>
  );
}

function RefundFormTrigger({ action, showForm, onToggle }) {
  return (
    <div className="space-y-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full max-w-[240px] items-center justify-between gap-2 rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-3 py-2 text-left text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10"
      >
        <span>{action.label}</span>
        <span className="text-[10px] text-(--muted-text)">{showForm ? 'Thu gọn' : 'Mở'}</span>
      </button>
      {showForm ? <RefundFormPlaceholder onClose={onToggle} /> : null}
    </div>
  );
}

function renderSimpleAction(action) {
  switch (action.type) {
    case 'VIEW_EVENTS':
      return <ActionChip>Xem sự kiện</ActionChip>;
    case 'VIEW_MY_TICKETS':
      return <ActionChip>Xem vé của tôi</ActionChip>;
    case 'VIEW_MY_ORDERS':
      return <ActionChip>Xem đơn hàng của tôi</ActionChip>;
    case 'LOGIN':
      return <ActionChip>Đăng nhập</ActionChip>;
    default:
      return <ActionChip>{action.label}</ActionChip>;
  }
}

function ChatMessageActions({ messageId, actions }) {
  const [showRefundForm, setShowRefundForm] = useState(false);

  if (!Array.isArray(actions) || actions.length === 0) return null;

  const eventActions = actions.filter((action) => action.type === 'VIEW_EVENT');
  const refundActions = actions.filter((action) => action.type === 'OPEN_REFUND_FORM');
  const simpleActions = actions.filter(
    (action) => action.type !== 'VIEW_EVENT' && action.type !== 'OPEN_REFUND_FORM'
  );

  return (
    <div className="mt-2.5 space-y-2 border-t border-(--border-color)/60 pt-2.5">
      {eventActions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {eventActions.map((action, index) => (
            <ViewEventCard key={`${messageId}-event-${index}`} action={action} />
          ))}
        </div>
      ) : null}

      {refundActions.map((action, index) => (
        <RefundFormTrigger
          key={`${messageId}-refund-${index}`}
          action={action}
          showForm={showRefundForm}
          onToggle={() => setShowRefundForm((prev) => !prev)}
        />
      ))}

      {simpleActions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {simpleActions.map((action, index) => (
            <span key={`${messageId}-action-${index}`}>{renderSimpleAction(action)}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ChatMessageActions;
