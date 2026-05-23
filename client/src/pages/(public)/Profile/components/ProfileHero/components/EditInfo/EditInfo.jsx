import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/lib/services/auth/authService";

function EditInfo() {
  const { user, setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const popoverRef = useRef(null);

  // Populate form khi component mount
  useEffect(() => {
    if (user) {
      setForm({
        name: user.fullName || "",
        phone: user.phoneNumber || "",
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
      
      // Update auth store với user mới
      if (response.data?.data) {
        setAuth({
          accessToken: user?.accessToken || null,
          refreshToken: user?.refreshToken || null,
          user: response.data.data,
        });
      }
      
      setOpenPopover(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Lỗi khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "block text-xs font-medium text-(--text-primary) mb-1 opacity-70";
  const inputClass =
    "w-full px-3 py-1.5 rounded-xl border border-(--primary-color)/30 bg-(--surface-color) text-(--text-primary) text-sm outline-none focus:border-(--primary-color) transition-colors placeholder:text-gray-400";

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
            <div
                className="flex items-center gap-4 p-2 border border-(--primary-color) rounded-4xl cursor-pointer 
                    hover:bg-(--primary-color)/10 hover:gap-6 hover:px-4 hover:shadow-[0_0_12px_var(--primary-color)] 
                    active:scale-95 transition-all duration-300 group"
                    >
            <Pen
                color="var(--primary-color)"
                className="transition-transform duration-300 group-hover:rotate-12"
            />
        <p className="text-(--text-primary) font-medium tracking-wide group-hover:tracking-wider transition-all duration-300">
            Chỉnh sửa thông tin
        </p>
        </div>
      </PopoverTrigger>

      <PopoverContent 
        align="start "
        className="w-80 p-4 rounded-2xl border border-(--primary-color)/30 bg-(--surface-color) shadow-xl">
        <h3 className="text-(--text-primary) font-semibold text-base mb-4">Chỉnh sửa thông tin</h3>

        <div className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className={labelClass}>Họ và tên</label>
            <input name="name" value={form.name} onChange={handle}
              placeholder="Nguyễn Văn A" className={inputClass} />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input name="phone" type="tel" value={form.phone} onChange={handle}
              placeholder="0912 345 678" className={inputClass} />
          </div>

          {/* Submit */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="mt-1 w-full py-2 rounded-xl bg-(--primary-color) text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EditInfo;