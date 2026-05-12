import {Lock, Mail, Phone, Send, User } from "lucide-react";

function ContactForm() {
    return ( 
        <div>
            <div className="flex items-center gap-3">
                <Send color="var(--primary-color)"/> 
                <h1 className="text-(--text-primary) text-xl uppercase font-medium">gửi liên hệ cho chúng tôi</h1>
            </div>

            <form className="flex flex-col gap-10 mt-7">
            {/* Họ và tên */}
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="username" className="text-(--text-primary) font-light">
                    Họ và tên <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
                    <User size={20} className="text-gray-500 transition-colors duration-300 group-focus-within:text-(--primary-color)"/>
                    <input
                        type="text"
                        id="username"
                        placeholder="Nhập họ và tên của bạn"
                        className="w-full text-sm text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="email" className="text-(--text-primary) font-light">
                    Email <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
                    <Mail size={20} className="text-gray-500 transition-colors duration-300 group-focus-within:text-(--primary-color)"/>
                    <input
                        type="text"
                        id="email"
                        placeholder="Nhập email của bạn"
                        className="w-full text-sm text-text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="phone" className="text-(--text-primary) font-light">
                    Số điện thoại <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="group flex w-full items-center gap-4 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus-within:border-(--primary-color) focus-within:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)]">
                    <Phone size={20} className="text-gray-500 transition-colors duration-300 group-focus-within:text-(--primary-color)"/>
                    <input
                        type="text"
                        id="phone"
                        placeholder="Nhập số điện thoại của bạn"
                        className="w-full text-sm text-text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600"
                    />
                </div>
            </div>

            {/* Nội dung */}
            <div className="flex flex-col items-start gap-2">
                <label htmlFor="content" className="text-(--text-primary) font-light">
                    Nội dung liên hệ <span className="ml-1 text-red-500">*</span>
                </label>
                <textarea
                    id="content"
                    placeholder="Bạn cần hỗ trợ vấn đề gì?"
                    className="w-full text-sm text-text-(--text-primary) bg-transparent outline-none placeholder:text-gray-600 border border-(--text-primary)/10 px-4 py-3 rounded-lg transition-all duration-300 hover:border-(--text-primary)/30 focus:border-(--primary-color) focus:shadow-[0_0_0_3px_rgba(var(--primary-rgb),0.15)] h-40 resize-none"
                />
            </div>

            {/* Button */}
            <button
                type="submit"
                className="uppercase bg-(--primary-color) flex items-center justify-center gap-2 p-4 rounded-lg w-full transition-all duration-300 hover:brightness-110 hover:shadow-[0_4px_20px_rgba(var(--primary-rgb),0.4)] active:scale-[0.98]"
            >
                <p className="font-medium text-white">gửi liên hệ</p>
                <Send size={18} color="white"/>
            </button>
        </form>

            <div className="flex items-center justify-center text-[17px] text-(--text-primary)/40 gap-3 mt-7">
                <Lock />
                <p>Thông tin của bạn được bảo mật và chỉ sử dụng để hỗ trợ</p>
            </div>
        </div>
     );
}

export default ContactForm;