import { useMemo, useRef, useState, useEffect } from 'react';
import {
  Bot,
  MessageCircle,
  SendHorizontal,
  Sparkles,
  X,
  Expand,
  Minimize2,
} from 'lucide-react';

const QUICK_SUGGESTIONS = [
  'Cách đặt vé?',
  'Chính sách hoàn vé',
  'Sự kiện sắp diễn ra',
  'Vé QR ở đâu?',
];

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    role: 'assistant',
    content:
      'Xin chào, mình là EventHub AI. Mình có thể hỗ trợ bạn về đặt vé, thanh toán, QR ticket và hoàn vé.',
  },
  {
    id: 'm2',
    role: 'user',
    content: 'Mình muốn biết cách nhận vé QR sau khi thanh toán.',
  },
  {
    id: 'm3',
    role: 'assistant',
    content:
      'Sau khi thanh toán thành công, bạn vào mục "Vé của tôi" để xem mã QR. Bạn cũng sẽ nhận email xác nhận kèm thông tin vé.',
  },
];

const getMockReply = (content) => {
  const normalizedText = content.toLowerCase();

  if (normalizedText.includes('đặt vé')) {
    return 'Bạn chọn sự kiện, chọn loại vé và thanh toán. Sau khi thành công, vé QR sẽ xuất hiện ngay trong tài khoản.';
  }

  if (normalizedText.includes('hoàn vé')) {
    return 'Chính sách hoàn vé tùy từng sự kiện. Bạn mở trang chi tiết sự kiện để xem thời hạn và mức phí hoàn cụ thể.';
  }

  if (normalizedText.includes('sắp diễn ra')) {
    return 'Bạn có thể vào trang chủ và xem mục sự kiện nổi bật hoặc xu hướng để cập nhật các sự kiện sắp diễn ra.';
  }

  if (normalizedText.includes('qr')) {
    return 'Vé QR nằm trong mục "Vé của tôi" sau khi thanh toán. Bạn chỉ cần mở mã này tại cổng check-in.';
  }

  return 'Mình đã nhận câu hỏi của bạn. Hiện tại đây là bản demo, nhưng mình luôn sẵn sàng hỗ trợ thông tin cơ bản về EventHub.';
};

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const messageContainerRef = useRef(null);

  const hasGreeting = useMemo(
    () => messages.some((message) => message.id === 'm1'),
    [messages]
  );

  useEffect(() => {
    if (!messageContainerRef.current) return;
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  }, [messages, isOpen]);

  const appendUserAndAssistantMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft('');

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: getMockReply(trimmed),
        },
      ]);
    }, 350);
  };

  const handleSend = () => appendUserAndAssistantMessage(draft);

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[9999] md:bottom-8 md:right-8">
      <button
        type="button"
        aria-label="Mở EventHub AI chat"
        onClick={() => setIsOpen(true)}
        className={`pointer-events-auto ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-(--border-color) bg-(--primary-color) text-white shadow-[0_0_24px_var(--primary-color)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_34px_var(--primary-color)] ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <MessageCircle size={20} />
      </button>

      {isOpen && (
        <div
          className={`pointer-events-auto mt-3 overflow-hidden border border-(--border-color) bg-(--card-surface-color) text-(--text-primary) shadow-2xl backdrop-blur-md transition-all duration-200 ${
            isExpanded
              ? 'fixed inset-4 mt-0 rounded-2xl sm:inset-6 md:inset-10'
              : 'h-[500px] w-[calc(100vw-2rem)] rounded-2xl sm:w-[360px]'
          }`}
        >
          <header className="flex items-center justify-between border-b border-(--border-color) bg-(--soft-surface-color) px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--primary-color)/20 text-(--primary-color)">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">EventHub AI</p>
                <p className="text-xs text-(--muted-text)">Trợ lý hỗ trợ sự kiện</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? 'Thu gọn chat' : 'Mở rộng chat'}
                className="rounded-lg p-2 text-(--muted-text) transition hover:bg-(--soft-surface-color) hover:text-(--text-primary)"
              >
                {isExpanded ? <Minimize2 size={16} /> : <Expand size={16} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                aria-label="Đóng chat"
                className="rounded-lg p-2 text-(--muted-text) transition hover:bg-(--soft-surface-color) hover:text-(--text-primary)"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <div className="flex h-[calc(100%-64px)] flex-col">
            <div ref={messageContainerRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'rounded-br-sm bg-(--primary-color) text-white'
                        : 'rounded-bl-sm border border-(--border-color) bg-(--surface-color) text-(--text-primary)'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {hasGreeting && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => appendUserAndAssistantMessage(suggestion)}
                      className="rounded-full border border-(--border-color) bg-(--soft-surface-color) px-3 py-1.5 text-xs text-(--text-primary) transition hover:border-(--primary-color)/40 hover:bg-(--primary-color)/15"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-(--border-color) bg-(--soft-surface-color) p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="h-10 flex-1 rounded-xl border border-(--border-color) bg-(--surface-color) px-3 text-sm outline-none transition focus:border-(--primary-color) focus:ring-2 focus:ring-(--primary-color)/30"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  aria-label="Gửi tin nhắn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--primary-color) text-white transition hover:brightness-110"
                >
                  <SendHorizontal size={16} />
                </button>
              </div>
              <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-(--muted-text)">
                <Sparkles size={12} />
                EventHub AI đang ở chế độ demo.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIChatWidget;