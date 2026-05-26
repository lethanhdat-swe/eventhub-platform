import { Save } from "lucide-react";
import ImageAIModelCard from "../ImageAIModelCard/ImageAIModelCard";

function PromptConfigCard({
  prompt,
  setPrompt,
  saved,
  handleSave,
  textareaRef,
  selectedImageAI,
  setSelectedImageAI,
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

          <p className="text-xs text-gray-400 mt-0.5">
            Hướng dẫn AI cách tạo nội dung blog cho EventHub
          </p>
        </div>
      </div>

      <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
        Nội dung prompt
      </p>

      <p className="mb-2 text-xs text-gray-400">
        Nhấn vào biến phía trên để chèn vào prompt
      </p>

      <textarea
        ref={textareaRef}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Nhập prompt hướng dẫn AI tạo nội dung blog..."
        className="w-full min-h-40 resize-y border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white leading-relaxed outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
      />

      {/* AI tạo ảnh */}
      <ImageAIModelCard
        selectedImageAI={selectedImageAI}
        setSelectedImageAI={setSelectedImageAI}
      />

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-300">
          {prompt.length} ký tự
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setPrompt("");
            }}
            className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Xóa
          </button>

          <button
            onClick={handleSave}
            className={`text-sm font-medium text-white rounded-lg px-4 py-2 transition-all flex items-center gap-1.5
              ${
                saved
                  ? "bg-emerald-600"
                  : "bg-gray-900 hover:bg-gray-700"
              }`}
          >
            {saved ? (
              <>
                <Save /> 
                Đã lưu
              </>
            ) : (
              <>
                <Save /> 
                Lưu cấu hình
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PromptConfigCard;