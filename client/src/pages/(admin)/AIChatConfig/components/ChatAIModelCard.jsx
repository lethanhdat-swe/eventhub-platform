import { Input } from '@/components/ui/input';

export default function ChatAIModelCard({ selectedAI, setSelectedAI }) {
    return (
        <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    🤖
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-900">
                        Chọn mô hình AI cho chat
                    </p>

                    <p className="mt-0.5 text-xs text-gray-600">
                        Nhập tên mô hình Groq dùng cho chat
                    </p>
                </div>
            </div>

            <Input
                value={selectedAI}
                onChange={(event) => setSelectedAI(event.target.value)}
                placeholder="Ví dụ: llama-3.3-70b-versatile"
                className="h-10"
            />
        </div>
    );
}
