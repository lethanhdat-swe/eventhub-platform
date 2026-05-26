import { useRef, useState } from "react";

import AIModelSelectCard from "./components/AIModelSelectCard/AIModelSelectCard";
import PromptConfigCard from "./components/PromptConfigCard/PromptConfigCard";

const DEFAULT_PROMPT = `Viết một bài blog hấp dẫn về sự kiện {{ten_su_kien}} diễn ra vào {{ngay_to_chuc}} tại {{dia_diem}}.

Nội dung cần:
- Giới thiệu tổng quan về sự kiện
- Nêu bật các điểm nổi bật và nghệ sĩ tham gia
- Khuyến khích người đọc đặt vé sớm

Giọng văn: Trẻ trung, năng động, cuốn hút.`;

function AIIdeaForm() {
  const [selectedAI, setSelectedAI] =
    useState("claude");

  // thêm AI tạo ảnh
  const [selectedImageAI, setSelectedImageAI] =
    useState("dalle");

  const [prompt, setPrompt] =
    useState(DEFAULT_PROMPT);

  const [saved, setSaved] = useState(false);

  const textareaRef = useRef(null);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  return (
    <div className="w-full pb-6 font-sans">
      <AIModelSelectCard
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
      />

      <PromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        saved={saved}
        handleSave={handleSave}
        textareaRef={textareaRef}
        selectedImageAI={selectedImageAI}
        setSelectedImageAI={setSelectedImageAI}
      />
    </div>
  );
}

export default AIIdeaForm;