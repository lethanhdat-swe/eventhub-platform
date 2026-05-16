import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
function CommentActions() {
    return (  
        <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        className="
          flex items-center justify-center
          w-10 h-10 rounded-full

          text-(--text-primary)/50
          transition-all duration-300

          hover:bg-white/5
          hover:text-fuchsia-400
          hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]
        "
      >
        <EllipsisVertical size={18} />
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="
        w-44 rounded-2xl
        border border-white/10
        bg-(--background-color)/95
        backdrop-blur-2xl
        shadow-[0_0_40px_rgba(168,85,247,0.15)]
        p-2
      "
    >
      <DropdownMenuItem
        className="
          flex items-center gap-3
        rounded-xl px-3 py-3
        cursor-pointer
        text-(--text-primary)
        transition-all duration-300

        data-highlighted:bg-(--primary-color)/10
        data-highlighted:text-(--text-primary)
        "
      >
        <Pencil size={16} className="transition-colors"/>
        Chỉnh sửa
      </DropdownMenuItem>

      <DropdownMenuItem
        className="flex items-center gap-3 px-3 py-3 text-red-400 cursor-pointer rounded-xl 
        data-highlighted:bg-red-400/10
        data-highlighted:text-(--text-primary)"
      >
        <Trash2 size={16} className=""/>
        Xóa bình luận
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
    );
}

export default CommentActions;