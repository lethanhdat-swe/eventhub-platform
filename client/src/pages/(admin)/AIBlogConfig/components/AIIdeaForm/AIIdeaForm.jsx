import { useRef } from "react";

import AIModelCard from "../AIBlogConfigForm/components/AIModelCard/AIModelCard";

import PromptConfigCard from "./components/PromptConfigCard/PromptConfigCard";

function AIIdeaForm({
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
        content="idea"
      />

      <PromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        textareaRef={textareaRef}
      />
    </div>
  );
}

export default AIIdeaForm;