import { MessageCircle } from 'lucide-react';

function EmptyChatState() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border bg-muted/40 text-muted-foreground">
        <MessageCircle size={24} />
      </div>
      <h3 className="text-lg font-semibold">Chọn một hội thoại</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Chọn hội thoại bên trái để xem tin nhắn.
      </p>
    </div>
  );
}

export default EmptyChatState;
