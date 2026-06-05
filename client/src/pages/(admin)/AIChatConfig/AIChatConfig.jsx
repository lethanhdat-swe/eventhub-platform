import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import PageHeader from '@/pages/(admin)/components/PageHeader';
import PromptActionBar from '@/pages/(admin)/AIBlogConfig/components/PromptActionBar/PromptActionBar';
import { aiBlogConfigService } from '@/lib/services/aiBlog';

import AIChatConfigForm from './components/AIChatConfigForm/AIChatConfigForm';

function AIChatConfig() {
  const [config, setConfig] = useState(null);
  const [saved, setSaved] = useState(false);
  const [chatModel, setChatModel] = useState('');
  const [chatSystemPrompt, setChatSystemPrompt] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await aiBlogConfigService.getAIChatConfig();
      setConfig(res);
      setChatModel(res.chatModel || '');
      setChatSystemPrompt(res.chatSystemPrompt || '');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!config?.id) {
      toast.error('Chưa tải được cấu hình');
      return;
    }

    try {
      await aiBlogConfigService.updateAIChatConfig(config.id, {
        chatModel,
        chatSystemPrompt,
      });
      toast.success('Lưu cấu hình thành công');
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      toast.error(err?.message || 'Lưu cấu hình thất bại');
      console.error(err);
    }
  };

  return (
    <div className="space-y-2">
      <PageHeader
        title="Quản lý cấu hình AI chat"
        description="Cấu hình mô hình và system prompt cho trợ lý EventHub AI"
      />

      <AIChatConfigForm
        selectedAI={chatModel}
        setSelectedAI={setChatModel}
        prompt={chatSystemPrompt}
        setPrompt={setChatSystemPrompt}
      />

      <PromptActionBar
        prompt={chatSystemPrompt}
        saved={saved}
        handleSave={handleSave}
      />
    </div>
  );
}

export default AIChatConfig;
