import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pen } from "lucide-react";
import { useState } from "react";

function EditInfo() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    sex: "",
  });

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const labelClass = "block text-xs font-medium text-(--text-primary) mb-1 opacity-70";
  const inputClass =
    "w-full px-3 py-1.5 rounded-xl border border-(--primary-color)/30 bg-(--surface-color) text-(--text-primary) text-sm outline-none focus:border-(--primary-color) transition-colors placeholder:text-gray-400";

  return (
    <Popover>
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

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="example@email.com" className={inputClass} />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input name="phone" type="tel" value={form.phone} onChange={handle}
              placeholder="0912 345 678" className={inputClass} />
          </div>

          {/* Date */}
          <div>
            <label className={labelClass}>Ngày sinh</label>
            <input name="date" type="date" value={form.date} onChange={handle}
              className={inputClass} />
          </div>

          {/* Sex */}
          <div>
            <label className={labelClass}>Giới tính</label>
            <select name="sex" value={form.sex} onChange={handle} className={inputClass}>
              <option value="" disabled>Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={() => console.log(form)}
            className="mt-1 w-full py-2 rounded-xl bg-(--primary-color) text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Lưu thay đổi
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default EditInfo;