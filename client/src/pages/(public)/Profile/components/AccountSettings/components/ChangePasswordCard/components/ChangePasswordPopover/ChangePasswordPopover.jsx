import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

  const resetForm = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const res = await userService.changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast.success(res.message || 'Đổi mật khẩu thành công');
      resetForm();
      setOpen(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Có lỗi xảy ra';

      const isActuallySuccess =
        message.toLowerCase().includes('success') ||
        message.toLowerCase().includes('thành công');

      if (isActuallySuccess) {
        toast.success(message);
        resetForm();
        setOpen(false);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    'block mb-1.5 sm:mb-2 text-sm font-medium text-(--text-primary)';
  const inputClass =
    'w-full px-4 h-11 sm:h-12 rounded-xl border border-(--primary-color)/30 bg-(--soft-surface-color) text-(--text-primary) text-sm outline-none transition placeholder:text-gray-400 focus:border-(--primary-color)';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
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
        </button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md rounded-2xl border border-(--primary-color)/30 bg-(--surface-color) p-5 sm:p-6 text-(--text-primary) shadow-xl ring-0"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-(--text-primary)">
            Đổi mật khẩu
          </DialogTitle>
          <DialogDescription className="text-(--muted-text)">
            Cập nhật mật khẩu mới cho tài khoản của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4 py-2">
          {[
            { label: 'Mật khẩu hiện tại', name: 'currentPassword' },
            { label: 'Mật khẩu mới', name: 'newPassword' },
            { label: 'Xác nhận mật khẩu', name: 'confirmPassword' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <input
                type="password"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 border-0 bg-transparent p-0 sm:justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-(--border-color) bg-transparent px-5 text-sm font-medium text-(--text-primary) transition hover:bg-(--soft-surface-color) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-color) px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePasswordPopover;
