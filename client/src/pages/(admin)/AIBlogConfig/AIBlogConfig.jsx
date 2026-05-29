import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";

import AIBlogConfigForm from "./components/AIBlogConfigForm/AIBlogConfigForm";
import AIIdeaForm from "./components/AIIdeaForm/AIIdeaForm";
import NumberLimitForm from "./components/NumberLimitForm/NumberLimitForm";
import StatusTable from "./components/StatusTable/StatusTable";

import AIModelCard from "./components/AIBlogConfigForm/components/AIModelCard/AIModelCard";

import PromptActionBar from "./components/PromptActionBar/PromptActionBar";

import { aiBlogConfigService } from "@/lib/services/aiBlog";
import { toast } from "sonner";

function AIBlogConfig() {
  const [config, setConfig] =
    useState(null);

  const [saved, setSaved] =
    useState(false);

  // IDEA
  const [ideaModel, setIdeaModel] =
    useState("");

  const [ideaPrompt, setIdeaPrompt] =
    useState("");

  // BLOG
  const [blogModel, setBlogModel] =
    useState("");

  const [blogPrompt, setBlogPrompt] =
    useState("");

  // IMAGE
  const [thumbnailModel, setThumbnailModel ] = useState("");
  const [blogIdeas, setBlogIdeas] =
    useState([]);


  useEffect(() => {
    fetchConfig();
    fetchBlogIdeas()
  }, []);

  const fetchBlogIdeas = async (
    ) => {
      try {
        const res =
          await aiBlogConfigService.listBlogAi({
            page: 1,
            size: 10,
          });

        setBlogIdeas(
          res.items || []
        );
      } catch (err) {
        console.error(err);
      }
    };
  const fetchConfig = async () => {
    try {
      const res =
        await aiBlogConfigService.getAIConfig();

      setConfig(res);

      setIdeaModel(res.ideaModel || "");
      setIdeaPrompt(res.ideaPrompt || "");

      setBlogModel(res.blogModel || "");
      setBlogPrompt(res.blogPrompt || "");

      setThumbnailModel(
        res.thumbnailModel || ""
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await aiBlogConfigService.updateAIConfig(
        config.id,
        {
          ideaModel,
          ideaPrompt,
          blogModel,
          blogPrompt,
          thumbnailModel,
          isActive: true,
        }
      );
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

  const handleGenerateIdeas = async (quantity) => {
    try {
      await aiBlogConfigService.createIdeaAiWithQuantity({ quantity });
      toast.success('Tạo ý tưởng thành công');
      fetchBlogIdeas();
    } catch (err) {
      toast.error(err?.message || 'Tạo ý tưởng thất bại');
      console.error(err);
    }
  };

  return (
    <div className="space-y-2">
      <PageHeader
        title="Quản lý cấu hình AI blog"
        description="Cấu hình và quản lý AI blog"
      />

      <AIBlogConfigForm
        selectedAI={blogModel}
        setSelectedAI={setBlogModel}
        prompt={blogPrompt}
        setPrompt={setBlogPrompt}
      />

      <AIIdeaForm
        selectedAI={ideaModel}
        setSelectedAI={setIdeaModel}
        prompt={ideaPrompt}
        setPrompt={setIdeaPrompt}
      />

      <AIModelCard
        selectedAI={thumbnailModel}
        setSelectedAI={
          setThumbnailModel
        }
        content="ảnh"
      />

      <PromptActionBar
          prompt={blogPrompt + ideaPrompt}
          saved={saved}
          handleSave={handleSave}
        />

      <NumberLimitForm
        onSubmit={handleGenerateIdeas}
      />

     <StatusTable
        data={blogIdeas}
      />
    </div>
  );
}

export default AIBlogConfig;