import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

type GenerateChatTextInput = {
    model: string;
    prompt: string;
};

class ChatAIProviderService {
    async generateText({ model, prompt }: GenerateChatTextInput) {
        const result = await generateText({
            model: groq(model),
            prompt,
        });

        return result.text;
    }
}

export default new ChatAIProviderService();
