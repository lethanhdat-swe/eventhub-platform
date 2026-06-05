export const OWNER_COLORS = {
  openai: "bg-emerald-500",
  anthropic: "bg-orange-500",
  google: "bg-blue-500",
  meta: "bg-blue-700",
  mistralai: "bg-orange-600",
  xai: "bg-black",
  deepseek: "bg-indigo-600",
  qwen: "bg-purple-600",
};

export function formatAIModels(models = []) {
  return models.map((item) => {
    const [provider, modelName] = item.id.split("/");

    return {
      id: item.id,
      provider,
      model: modelName,
      label: provider,
      initials: provider.slice(0, 2).toUpperCase(),
      color:
        OWNER_COLORS[provider] || "bg-gray-500",
    };
  });
}