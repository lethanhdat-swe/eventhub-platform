import { Mail, Phone, User } from "lucide-react";

function CustomerFormSection({
    value = {
        name: '',
        email: '',
        phone: '',
    },
    onChange,
}) {
    const form = value;

    const handleChange = (e) => {
        onChange?.({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5 space-y-4 lg:p-6">
            <p className="text-(--text-primary) uppercase text-lg">thông tin người đặt vé</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Họ và tên */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-3 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-1.5 flex-1">
                        <p className="text-(--text-primary)/70 text-sm">Họ và tên</p>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập họ và tên"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <User color="var(--text-primary)" size={18} />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-3 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-1.5 flex-1">
                        <p className="text-(--text-primary)/70 text-sm">Email</p>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <Mail color="var(--text-primary)" size={18} />
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-3 focus-within:border-(--text-primary)/40 transition">
                    <div className="space-y-1.5 flex-1">
                        <p className="text-(--text-primary)/70 text-sm">Số điện thoại</p>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            className="bg-transparent text-(--text-primary) outline-none w-full placeholder:text-(--text-primary)/30"
                        />
                    </div>
                    <Phone color="var(--text-primary)" size={18} />
                </div>
            </div>
        </div>
    );
}

export default CustomerFormSection;