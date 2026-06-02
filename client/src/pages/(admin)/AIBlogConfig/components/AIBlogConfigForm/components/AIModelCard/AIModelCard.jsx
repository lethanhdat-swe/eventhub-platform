import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

import useAIModels from "@/hooks/useAIModels";
import { Check } from "lucide-react";

export default function AIModelCard({
  selectedAI,
  setSelectedAI,
  content
}) {
  const { models, loading } = useAIModels();

  const selectedModel = models.find(
    (m) => m.id === selectedAI
  );

  return (
    <div className="p-5 mb-4 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-lg">
          🤖
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">
            Chọn mô hình AI để tạo {content}
          </p>

          <p className="text-xs text-gray-400 mt-0.5">
            Mô hình dùng để tạo blog
          </p>
        </div>
      </div>

      <Select
        value={selectedAI}
        onValueChange={setSelectedAI}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={
              loading
                ? "Đang tải models..."
                : "Chọn mô hình AI"
            }
          >
            {selectedModel && (
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded ${selectedModel.color} flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {selectedModel.initials}
                </div>

                <span className="capitalize">
                  {selectedModel.provider}
                </span>

                <span className="text-xs text-gray-400 truncate">
                  — {selectedModel.model}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="max-h-100">
          <SelectGroup>
            <SelectLabel>
              Danh sách AI Models
            </SelectLabel>

            {models.map((ai) => {
                const isSelected =
                  ai.id === selectedAI;

                return (
                  <SelectItem
                    key={ai.id}
                    value={ai.id}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded ${ai.color} flex items-center justify-center text-white text-[10px] font-bold`}
                        >
                          {ai.initials}
                        </div>

                        <span className="capitalize">
                          {ai.provider}
                        </span>

                        <span className="text-xs text-gray-400">
                          — {ai.model}
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}