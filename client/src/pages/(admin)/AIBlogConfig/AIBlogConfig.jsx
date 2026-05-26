import PageHeader from "../components/PageHeader";
import AIBlogConfigForm from "./components/AIBlogConfigForm/AIBlogConfigForm";
import AIIdeaForm from "./components/AIIdeaForm/AIIdeaForm";
import NumberLimitForm from "./components/NumberLimitForm/NumberLimitForm";
import StatusTable from "./components/StatusTable/StatusTable";

function AIBlogConfig() {
    return ( 
        <div className="space-y-2">
            <PageHeader
                title="Quản lý cấu hình AI blog"
                description="Cấu hình và quản lý các thiết lập cho chức năng blog được hỗ trợ bởi AI."
            />

            <AIBlogConfigForm />
            <AIIdeaForm />
            <NumberLimitForm />
            <StatusTable />
        </div>
     );
}

export default AIBlogConfig;