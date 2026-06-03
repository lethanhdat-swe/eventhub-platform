import { useRef } from 'react';

import AIModelCard from '@/pages/(admin)/AIBlogConfig/components/AIBlogConfigForm/components/AIModelCard/AIModelCard';

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
      <AIModelCard
        selectedAI={selectedAI}
        setSelectedAI={setSelectedAI}
        content="chat"
      />

      <ChatPromptConfigCard
        prompt={prompt}
        setPrompt={setPrompt}
        textareaRef={textareaRef}
      />
    </div>
  );
}
