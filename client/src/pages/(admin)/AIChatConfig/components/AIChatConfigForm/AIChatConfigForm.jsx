import { useRef } from 'react';

import ChatAIModelCard from '../ChatAIModelCard';
import ChatPromptConfigCard from '../ChatPromptConfigCard';

export default function AIChatConfigForm({
  selectedAI,
  setSelectedAI,
  prompt,
  setPrompt,
}) {
  const textareaRef = useRef(null);

  return (
    <div className="w-full pb-6 font-sans">
      <ChatAIModelCard
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
      />

      <ChatPromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        textareaRef={textareaRef}
      />
    </div>
  );
}
