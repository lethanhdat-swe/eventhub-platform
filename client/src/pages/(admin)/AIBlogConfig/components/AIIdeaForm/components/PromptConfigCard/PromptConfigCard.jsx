function PromptConfigCard({
  prompt,
  setPrompt,
  textareaRef,
}) {
  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-lg">
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
            Cấu hình prompt
          </p>

          <p className="text-xs text-gray-600 mt-0.5">
            Hướng dẫn AI cách tạo nội dung blog cho EventHub
          </p>
        </div>
      </div>

      <p className="text-[11px] font-medium uppercase tracking-widest text-gray-600 mb-1.5">
        Nội dung prompt
      </p>

      <p className="mb-2 text-xs text-gray-600">
        Nhấn vào biến phía trên để chèn vào prompt
      </p>

      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Nhập prompt hướng dẫn AI tạo nội dung blog..."
        className="w-full min-h-40 resize-y border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white leading-relaxed outline-none focus:border-gray-400 transition-colors placeholder:text-gray-400"
      />   
    </div>
  );
}

export default PromptConfigCard;