import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/lib/services/auth/authService';
import { toast } from 'sonner';

function EditInfo() {
    const { user, setUser } = useAuthStore();
    const [form, setForm] = useState({
        name: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                name: user.fullName || '',
                phone: user.phoneNumber || '',
            });
        }
    }, [user]);

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            setIsLoading(true);

            const response = await authService.updateMe({
                fullName: form.name,
                phoneNumber: form.phone,
            });

            const updatedUser = response.data?.data ?? response.data;

            setUser({
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                id: user.id,
                role: user.role,
            });

            toast.success('Cập nhật thông tin thành công');
            setOpen(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(
                error?.response?.data?.message || 'Lỗi khi cập nhật thông tin'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const labelClass =
        'block text-xs font-medium text-(--text-primary) mb-1 opacity-70';
    const inputClass =
        'w-full px-3 py-2 rounded-xl border border-(--primary-color)/30 bg-(--soft-surface-color) text-(--text-primary) text-sm outline-none focus:border-(--primary-color) transition-colors placeholder:text-gray-400';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-2 sm:gap-4 p-2 border border-(--primary-color) rounded-4xl cursor-pointer 
                hover:bg-(--primary-color)/10 hover:gap-4 sm:hover:gap-6 hover:px-3 sm:hover:px-4 
                hover:shadow-[0_0_12px_var(--primary-color)] active:scale-95 transition-all duration-300 group"
                >
                    <Pen
                        color="var(--primary-color)"
                        className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 sm:w-5 sm:h-5"
                    />
                    <span className="text-(--text-primary) text-sm sm:text-base font-medium tracking-wide group-hover:tracking-wider transition-all duration-300">
                        Chỉnh sửa thông tin
                    </span>
                </button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-md rounded-2xl border border-(--primary-color)/30 bg-(--surface-color) p-5 sm:p-6 text-(--text-primary) shadow-xl ring-0"
                showCloseButton
            >
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-(--text-primary)">
                        Chỉnh sửa thông tin
                    </DialogTitle>
                    <DialogDescription className="text-(--muted-text)">
                        Cập nhật họ tên và số điện thoại của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <div>
                        <label className={labelClass}>Họ và tên</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handle}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Số điện thoại</label>
                        <input
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handle}
                            className={inputClass}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 border-0 bg-transparent p-0 sm:justify-end">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-(--border-color) bg-transparent px-5 text-sm font-medium text-(--text-primary) transition hover:bg-(--soft-surface-color) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isLoading}
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-(--primary-color) px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EditInfo;
