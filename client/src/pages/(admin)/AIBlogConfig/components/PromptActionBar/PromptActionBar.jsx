import { Save } from "lucide-react";

function PromptActionBar({
  prompt = "",
  saved = false,
  handleSave,
  loading = false,
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-xs text-gray-300">
        {prompt.length} ký tự
      </span>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`text-sm font-medium text-white rounded-lg px-4 py-2 transition-all flex items-center gap-1.5
          ${
            saved
              ? "bg-emerald-600"
              : "bg-gray-900 hover:bg-gray-700"
          }
          ${
            loading
              ? "opacity-60 cursor-not-allowed"
              : ""
          }
        `}
      >
        <Save className="w-4 h-4" />

        {loading
          ? "Đang lưu..."
          : saved
          ? "Đã lưu"
          : "Lưu cấu hình"}
      </button>
    </div>
  );
}

export default PromptActionBar;