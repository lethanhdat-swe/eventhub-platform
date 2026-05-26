import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const IMAGE_MODELS = [
  {
    id: "dalle",
    label: "DALL·E",
    model: "DALL·E 3",
    initials: "Da",
    color: "bg-purple-600",
  },
  {
    id: "midjourney",
    label: "Midjourney",
    model: "V6",
    initials: "Mj",
    color: "bg-pink-600",
  },
  {
    id: "flux",
    label: "Flux",
    model: "Flux Pro",
    initials: "Fl",
    color: "bg-black",
  },
  {
    id: "sdxl",
    label: "Stable Diffusion",
    model: "SDXL",
    initials: "SD",
    color: "bg-blue-600",
  },
  {
    id: "imagen",
    label: "Imagen",
    model: "Imagen 3",
    initials: "Im",
    color: "bg-emerald-600",
  },
];

function ImageAIModelCard({
  selectedImageAI,
  setSelectedImageAI,
}) {
  return (
    <div className="mt-5">
      <p className="text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
        AI tạo hình ảnh
      </p>

      <Select
        value={selectedImageAI}
        onValueChange={setSelectedImageAI}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Chọn AI tạo ảnh">
            {selectedImageAI &&
              (() => {
                const ai = IMAGE_MODELS.find(
                  (m) => m.id === selectedImageAI
                );

                return ai ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded ${ai.color} flex items-center justify-center text-white text-[10px] font-bold`}
                    >
                      {ai.initials}
                    </div>

                    <span>{ai.label}</span>

                    <span className="text-xs text-gray-400">
                      — {ai.model}
                    </span>
                  </div>
                ) : null;
              })()}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>AI tạo hình ảnh</SelectLabel>

            {IMAGE_MODELS.map((ai) => (
              <SelectItem key={ai.id} value={ai.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded ${ai.color} flex items-center justify-center text-white text-[10px] font-bold`}
                  >
                    {ai.initials}
                  </div>

                  <span>{ai.label}</span>

                  <span className="text-xs text-gray-400">
                    — {ai.model}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default ImageAIModelCard;