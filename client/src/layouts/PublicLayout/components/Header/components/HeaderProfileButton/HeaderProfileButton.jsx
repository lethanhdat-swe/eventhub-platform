import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

function HeaderProfileButton() {
  const handleLogout = () => {
    console.log("logout");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="outline-none cursor-pointer p-2 rounded-full border border-transparent hover:border-(--primary-color)/40 hover:bg-(--primary-color)/10 hover:shadow-[0_0_10px_var(--primary-color)] active:scale-95 transition-all duration-300 group">
          <User
            size={20}
            color="var(--text-primary)"
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 mt-2 rounded-2xl border border-(--primary-color)/20 bg-(--surface-color) shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="px-3 py-2 mb-1 border-b border-(--primary-color)/10">
          <p className="text-xs text-(--text-primary) opacity-50 tracking-widest uppercase">Tài khoản</p>
        </div>

        <DropdownMenuItem asChild>
            <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-(--text-primary) cursor-pointer hover:bg-(--primary-color)/10 transition-colors duration-200 group/item w-full"
            >
                <div className="p-1 rounded-lg bg-(--primary-color)/10 group-hover/item:bg-(--primary-color)/20 transition-colors">
                <User size={13} color="var(--primary-color)" />
                </div>
                <span className="font-medium">Profile</span>
            </Link>
        </DropdownMenuItem>

        <div className="my-1 border-t border-(--primary-color)/10" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-200 cursor-pointer rounded-xl hover:bg-red-500/10 group/logout"
        >
          <div className="p-1 transition-colors rounded-lg bg-red-500/10 group-hover/logout:bg-red-500/20">
            <LogOut size={13} color="rgb(239 68 68)" />
          </div>
          <span className="font-medium text-red-500">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default HeaderProfileButton;