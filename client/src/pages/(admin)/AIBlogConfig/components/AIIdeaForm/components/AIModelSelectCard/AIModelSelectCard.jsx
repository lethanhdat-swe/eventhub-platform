import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const AI_MODELS = [
  { id: "claude", label: "Claude", model: "Sonnet 4.5", initials: "Cl", color: "bg-orange-500" },
  { id: "openai", label: "ChatGPT", model: "GPT-4o", initials: "GP", color: "bg-emerald-500" },
  { id: "gemini", label: "Gemini", model: "2.0 Flash", initials: "Ge", color: "bg-blue-500" },
  { id: "mistral", label: "Mistral", model: "Large 2", initials: "Mi", color: "bg-orange-600" },
  { id: "llama", label: "Llama", model: "3.3 70B", initials: "Ll", color: "bg-blue-700" },
  { id: "grok", label: "Grok", model: "3 Beta", initials: "Gr", color: "bg-gray-900" },
];

function AIModelSelectCard({
  selectedAI,
  setSelectedAI,
}) {
  return (
    <div className="p-5 mb-4 bg-white border border-gray-200 rounded-xl">
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
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            Chọn mô hình AI
          </p>

          <p className="text-xs text-gray-400 mt-0.5">
            Mô hình được dùng để tạo nội dung title
          </p>
        </div>
      </div>

      <Select value={selectedAI} onValueChange={setSelectedAI}>
        <SelectTrigger className="w-full max-w-xs">
          <SelectValue placeholder="Chọn mô hình AI">
            {selectedAI &&
              (() => {
                const ai = AI_MODELS.find(
                  (m) => m.id === selectedAI
                );

                return ai ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded ${ai.color} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {ai.initials}
                    </div>

                    <span>{ai.label}</span>

                    <span className="text-xs text-gray-400">
                      — {ai.model}
                    </span>
                  </div>
                ) : null;
              })()}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Mô hình AI</SelectLabel>

            {AI_MODELS.map((ai) => (
              <SelectItem key={ai.id} value={ai.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded ${ai.color} flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {ai.initials}
                  </div>

                  <span>{ai.label}</span>

                  <span className="text-xs text-gray-400">
                    — {ai.model}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default AIModelSelectCard;