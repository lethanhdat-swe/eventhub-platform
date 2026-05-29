import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

function CommentActions({ onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-(--text-primary)/50 transition-all duration-300 hover:bg-white/5 hover:text-fuchsia-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]">
          <EllipsisVertical size={16} className="sm:hidden" />
          <EllipsisVertical size={18} className="hidden sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 sm:w-44 rounded-xl sm:rounded-2xl border border-white/10 bg-(--background-color)/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(168,85,247,0.15)] p-1.5 sm:p-2"
      >
        <DropdownMenuItem
          onClick={onEdit}
          className="flex items-center gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2.5 sm:py-3 cursor-pointer text-xs sm:text-sm text-(--text-primary) transition-all duration-300 data-highlighted:bg-(--primary-color)/10 data-highlighted:text-(--text-primary)"
        >
          <Pencil size={14} className="sm:hidden" />
          <Pencil size={16} className="hidden sm:block" />
          Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 text-xs sm:text-sm text-red-400 cursor-pointer rounded-lg sm:rounded-xl data-highlighted:bg-red-400/10 data-highlighted:text-(--text-primary)"
        >
          <Trash2 size={14} className="sm:hidden" />
          <Trash2 size={16} className="hidden sm:block" />
          Xóa bình luận
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CommentActions;