import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronRight } from 'lucide-react';
import { userService } from '@/lib/services/admin';
import { toast } from 'sonner';

function ChangePasswordPopover() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await userService.changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(res.message || "Đổi mật khẩu thành công");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setOpen(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra";

      const isActuallySuccess =
        message.toLowerCase().includes("success") ||
        message.toLowerCase().includes("thành công");

      if (isActuallySuccess) {
        toast.success(message);

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setOpen(false);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className="
            mt-6 sm:mt-8 inline-flex items-center gap-2 rounded-full
            bg-(--primary-color) text-white
            px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold
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
          w-[calc(100vw-2rem)] max-w-sm sm:w-96
          rounded-3xl border border-white/10
          bg-[#0B1120]/95
          p-5 sm:p-6 backdrop-blur-2xl
        "
      >
        <div className="space-y-4 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Đổi mật khẩu
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Cập nhật mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { label: 'Mật khẩu hiện tại', name: 'currentPassword' },
              { label: 'Mật khẩu mới', name: 'newPassword' },
              { label: 'Xác nhận mật khẩu', name: 'confirmPassword' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block mb-1.5 sm:mb-2 text-sm text-gray-300">
                  {label}
                </label>
                <input
                  type="password"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 text-white transition-all duration-300 border outline-none h-11 sm:h-12 rounded-xl border-white/10 bg-white/5 placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-purple-500/5"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full rounded-xl bg-(--primary-color)
              py-2.5 sm:py-3 font-semibold text-white text-sm
              transition-all duration-300
              hover:scale-[1.02]
              disabled:opacity-50
              cursor-pointer
            "
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ChangePasswordPopover;