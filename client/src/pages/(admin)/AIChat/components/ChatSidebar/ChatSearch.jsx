import { Search } from 'lucide-react';

function ChatSearch({ value, onChange }) {
    return (
        <div className="relative">
            <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Tìm hội thoại..."
                className="h-10 w-full rounded-xl border bg-background pl-9 pr-3 text-sm! outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
            />
        </div>
    );
}

export default ChatSearch;
