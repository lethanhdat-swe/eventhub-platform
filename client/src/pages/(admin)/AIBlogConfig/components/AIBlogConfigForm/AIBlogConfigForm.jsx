import { useState, useRef } from "react";
import AIModelCard from "./components/AIModelCard/AIModelCard";
import PromptConfigCard from "./components/PromptConfigCard/PromptConfigCard";

const DEFAULT_PROMPT = `Viết một bài blog hấp dẫn về sự kiện {{ten_su_kien}} diễn ra vào {{ngay_to_chuc}} tại {{dia_diem}}.

Nội dung cần:
- Giới thiệu tổng quan về sự kiện
- Nêu bật các điểm nổi bật và nghệ sĩ tham gia
- Khuyến khích người đọc đặt vé sớm

Giọng văn: Trẻ trung, năng động, cuốn hút.`;

export default function AIBlogConfigForm() {
  const [selectedAI, setSelectedAI] =
    useState("claude");

  const [prompt, setPrompt] =
    useState(DEFAULT_PROMPT);

  const textareaRef = useRef(null);

  return (
    <div className="w-full pb-6 font-sans">
      <AIModelCard
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
      />

      <PromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        textareaRef={textareaRef}
      />
    </div>
  );
}