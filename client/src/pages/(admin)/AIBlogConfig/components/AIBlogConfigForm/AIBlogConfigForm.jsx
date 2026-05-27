import { useRef } from "react";

import AIModelCard from "./components/AIModelCard/AIModelCard";

import PromptConfigCard from "./components/PromptConfigCard/PromptConfigCard";

export default function AIBlogConfigForm({
  selectedAI,
  setSelectedAI,
  prompt,
  setPrompt,
}) {
  const textareaRef = useRef(null);

  return (
    <div className="w-full pb-6 font-sans">
      <AIModelCard
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
        content="blog"
      />

      <PromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        textareaRef={textareaRef}
      />
    </div>
  );
}