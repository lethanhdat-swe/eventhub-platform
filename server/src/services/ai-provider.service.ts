import { generateImage, generateText } from "ai";

class AIProviderService {
    async generateText({ model, prompt }: { model: string; prompt: string }) {
        const result = await generateText({
            model: model,
            prompt: prompt,
        });

        return result.text;
    }

    async generateImage({ model, prompt }: { model: string; prompt: string }) {
        const result = await generateImage({
            model,
            prompt,
            aspectRatio: "16:9",
        });

        const image = result.images?.[0];

        if (!image?.base64) {
            return null;
        }

        return `data:image/png;base64,${image.base64}`;
    }
}

export default new AIProviderService();
