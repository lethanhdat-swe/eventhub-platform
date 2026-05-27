import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import AIModelCard from "../../../AIBlogConfigForm/components/AIModelCard/AIModelCard";

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

function ImageAIModelCard(props) {
 return (
     <AIModelCard {...props} />
   );
}

export default ImageAIModelCard;