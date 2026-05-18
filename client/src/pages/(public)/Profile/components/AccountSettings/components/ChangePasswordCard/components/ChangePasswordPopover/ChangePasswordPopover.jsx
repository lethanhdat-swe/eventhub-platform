import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronRight } from "lucide-react";

function ChangePasswordPopover() {
    return ( 
        <Popover>
        <PopoverTrigger asChild>
          <div
            className="
              mt-8 flex items-center gap-2 rounded-full
              bg-(--primary-color)
              text-white
              px-5 py-3 text-sm font-semibold 
              shadow-[0_0_30px_rgba(168,85,247,0.35)]
              transition-all duration-300
              hover:scale-[1.03]
              hover:shadow-[0_0_40px_rgba(168,85,247,0.45)]
              cursor-pointer
            "
          >
            Đổi mật khẩu

            <ChevronRight className="w-4 h-4" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="
            w-96 rounded-3xl border border-white/10
            bg-[#0B1120]/95
            p-6 backdrop-blur-2xl
          "
        >
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Đổi mật khẩu
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Cập nhật mật khẩu mới cho tài khoản của bạn.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Mật khẩu hiện tại
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 text-white transition-all duration-300 border outline-none rounded-xl border-white/10 bg-white/5 placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-purple-500/5"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Mật khẩu mới
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 text-white transition-all duration-300 border outline-none rounded-xl border-white/10 bg-white/5 placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-purple-500/5"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-300">
                  Xác nhận mật khẩu
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 px-4 text-white transition-all duration-300 border outline-none rounded-xl border-white/10 bg-white/5 placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-purple-500/5"
                />
              </div>
            </div>

            <button
              className="
                w-full rounded-xl bg-(--primary-color)
                py-3 font-semibold text-white
                transition-all duration-300
                hover:scale-[1.02]
              "
            >
              Cập nhật mật khẩu
            </button>
          </div>
        </PopoverContent>
      </Popover>
     );
}

export default ChangePasswordPopover;