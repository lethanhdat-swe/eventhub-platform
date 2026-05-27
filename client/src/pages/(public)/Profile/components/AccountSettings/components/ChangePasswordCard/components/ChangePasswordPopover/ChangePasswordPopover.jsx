import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronRight } from 'lucide-react';
import { userService } from '@/lib/services/admin';

function ChangePasswordPopover() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await userService.changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      console.log('res: ', res);

      alert(res.message || 'Đổi mật khẩu thành công');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setOpen(false);

    } catch (error) {
      console.log(error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra';

      // API trả 400 nhưng thực ra thành công
      const isActuallySuccess =
        message.toLowerCase().includes('success') ||
        message.toLowerCase().includes('thành công');

      if (isActuallySuccess) {
        alert(message);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setOpen(false);
      } else {
        alert(message);
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
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
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
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
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
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 px-4 text-white transition-all duration-300 border outline-none rounded-xl border-white/10 bg-white/5 placeholder:text-gray-500 focus:border-purple-500/40 focus:bg-purple-500/5"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full rounded-xl bg-(--primary-color)
              py-3 font-semibold text-white
              transition-all duration-300
              hover:scale-[1.02]
              disabled:opacity-50
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