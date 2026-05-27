import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import AIBlogConfigForm from "./components/AIBlogConfigForm/AIBlogConfigForm";
import AIIdeaForm from "./components/AIIdeaForm/AIIdeaForm";
import NumberLimitForm from "./components/NumberLimitForm/NumberLimitForm";
import StatusTable from "./components/StatusTable/StatusTable";
import { aiBlogConfigService } from "@/lib/services/aiBlog";

function AIBlogConfig() {
    
    const [aiConfig, setAiConfig] = useState(null);
     
    useEffect(() => {
        // Fetch AI blog configuration when component mounts
        const fetchAIConfig = async () => {
            const config = await aiBlogConfigService.getAIConfig();
            setAiConfig(config);
        };

        fetchAIConfig();
    }, []);

    console.log('AI Blog Config:', aiConfig);

    return ( 
        <div className="space-y-2">
            <PageHeader
                title="Quản lý cấu hình AI blog"
                description="Cấu hình và quản lý các thiết lập cho chức năng blog được hỗ trợ bởi AI."
            />

            <AIBlogConfigForm aiConfig={aiConfig} />
            <AIIdeaForm />
            <NumberLimitForm />
            <StatusTable />
        </div>
     );
}

export default AIBlogConfig;