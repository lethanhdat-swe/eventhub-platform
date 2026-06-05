import {
  getStatusNoticeText,
  shouldShowStatusNotice,
} from '@/lib/aiChat/chatSessionStatus';

function ChatStatusNotice({ status, messages = [] }) {
  if (!shouldShowStatusNotice(status, messages)) {
    return null;
  }

  const noticeText = getStatusNoticeText(status);

  if (!noticeText) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-xl border border-(--border-color) bg-(--soft-surface-color) px-3 py-2.5 text-center text-xs leading-relaxed text-(--muted-text)"
    >
      {noticeText}
    </div>
  );
}

export default ChatStatusNotice;
