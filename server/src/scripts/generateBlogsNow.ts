import aiBlogWriterService from "../services/ai-blog-writer.service";
import { prisma } from "../utils/prisma";

async function main() {
    const quantity = Number(process.argv[2] || 4);

    console.log(`[AI_BLOG] Start generating ${quantity} blogs...`);

    for (let i = 1; i <= quantity; i++) {
        try {
            const result = await aiBlogWriterService.generateNextPendingBlog();

            if (!result) {
                console.log(
                    `[AI_BLOG] ${i}/${quantity}: No pending blog idea found`
                );
                break;
            }

            console.log(
                `[AI_BLOG] ${i}/${quantity}: Generated blog: ${result.title}`
            );
        } catch (error) {
            console.error(`[AI_BLOG] ${i}/${quantity}: Failed`, error);
        }
    }

    console.log("[AI_BLOG] Done");
}

main()
    .catch((error) => {
        console.error("[AI_BLOG] Script failed", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
