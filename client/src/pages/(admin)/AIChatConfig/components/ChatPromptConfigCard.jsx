export default function ChatPromptConfigCard({
  prompt,
  setPrompt,
  textareaRef,
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            Cấu hình system prompt
          </p>

          <p className="mt-0.5 text-xs text-gray-600">
            Hướng dẫn trợ lý EventHub về đặt vé, thanh toán, vé QR và hoàn vé
          </p>
        </div>
      </div>

      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-widest text-gray-600">
        Nội dung prompt
      </p>

      <p className="mb-2 text-xs text-gray-600">
        System prompt áp dụng cho widget AI trên website công khai
      </p>

      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Nhập system prompt cho EventHub AI..."
        className="min-h-40 w-full resize-y rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{prompt.length} ký tự</span>
      </div>
    </div>
  );
}
