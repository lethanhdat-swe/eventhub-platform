import { Mail, Phone, User } from "lucide-react";
import { useState } from "react";

function CustomerFormSection() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="col-span-8 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10 space-y-5">
            <p className="text-(--text-primary) uppercase text-xl">thông tin người đặt vé</p>

            <div className="grid grid-cols-3 gap-15">
                {/* Họ và tên */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-2 flex-1">
                        <p className="text-(--text-primary)/70">Họ và tên</p>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <User color="var(--text-primary)" />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-2 flex-1">
                        <p className="text-(--text-primary)/70">Email</p>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <Mail color="var(--text-primary)" />
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-2 flex-1">
                        <p className="text-(--text-primary)/70">Số điện thoại</p>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <Phone color="var(--text-primary)" />
                </div>
            </div>
        </div>
    );
}

export default CustomerFormSection;