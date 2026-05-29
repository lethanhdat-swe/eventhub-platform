import { Lock } from "lucide-react";
import ChangePasswordPopover from "./components/ChangePasswordPopover/ChangePasswordPopover";

function ChangePasswordCard() {
  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl
        border border-(--text-primary)/10 bg-(--text-primary)/3
        p-5 sm:p-6 backdrop-blur-xl
        transition-all duration-500
        hover:border-(--primary-color)/30
        hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]
      "
    >
      <div className="relative flex items-start gap-4">
        <div
          className="
            shrink-0
            flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl
            border border-(--primary-color)/20
            bg-(--primary-color)/10
            text-(--primary-color)
            shadow-[0_0_25px_rgba(168,85,247,0.2)]
          "
        >
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold text-(--text-primary)">
            Đổi mật khẩu
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-400 sm:mt-2">
            Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên.
          </p>
        </div>
      </div>

      <ChangePasswordPopover />
    </div>
  );
}

export default ChangePasswordCard;