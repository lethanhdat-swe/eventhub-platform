import { Lock } from "lucide-react";
import ChangePasswordPopover from "./components/ChangePasswordPopover/ChangePasswordPopover";

function ChangePasswordCard() {
  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl
        border border-(--text-primary)/10 bg-(--text-primary)/3
        p-6 backdrop-blur-xl
        transition-all duration-500
        hover:border-(--primary-color)/30
        hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]
      "
    >
      <div className="relative flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-14 w-14 items-center justify-center rounded-2xl
              border border-(--primary-color)/20
              bg-(--primary-color)/10
              text-(--primary-color)
              shadow-[0_0_25px_rgba(168,85,247,0.2)]
            "
          >
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-(--text-primary)">
              Đổi mật khẩu
            </h3>

            <p className="max-w-xs mt-2 text-sm leading-relaxed text-gray-400">
              Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu thường xuyên.
            </p>
          </div>
        </div>
      </div>
        <ChangePasswordPopover />
    </div>
  );
}

export default ChangePasswordCard;