import aiBlogWriterService from "../../services/ai-blog-writer.service";

export const generateWeeklyBlogTask = async () => {
    const result = await aiBlogWriterService.generateNextPendingBlog();

    if (result) {
        console.log(`[AI_BLOG] Generated blog: ${result.title}`);
    } else {
        console.log("[AI_BLOG] No pending blog idea found");
    }
};
