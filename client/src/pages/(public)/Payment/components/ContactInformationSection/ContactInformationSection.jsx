import { Contact, Mail, Phone } from "lucide-react";

function ContactInformationSection() {
    return ( 
        <div>
             <div className="flex items-center gap-3 mt-10 mb-5">
                <Contact color="var(--primary-color)" size={24}/>
                <p className="text-(--text-primary) text-xl font-medium">Thông tin liên hệ</p> 
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="flex items-center gap-4 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5">
                    <div className="rounded-xl p-4 bg-(--surface-color)/60 border border-(--text-primary)/40">
                        <Mail color="var(--text-primary)" />
                    </div>
                    <div className="flex flex-col items-start gap-1 ">
                        <h1 className="text-(--text-primary)/60 font-semibold text-[16px]">Email</h1>
                        <p className="text-(--text-primary) text-xl">nguyenvana@gmail.com</p>
                    </div>
               </div>

               <div className="flex items-center gap-4 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-5">
                    <div className="rounded-xl p-4 bg-(--surface-color)/60 border border-(--text-primary)/40">
                        <Phone color="var(--text-primary)" />
                    </div>
                    <div className="flex flex-col items-start gap-1 ">
                        <h1 className="text-(--text-primary)/60 font-semibold text-[16px]">Phone</h1>
                        <p className="text-(--text-primary) text-xl">nguyenvana@gmail.com</p>
                    </div>
               </div>
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-2xl border px-6 py-5 backdrop-blur-xl bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(168,85,247,0.06))] border-[rgba(168,85,247,0.25)] shadow-[0_0_30px_rgba(168,85,247,0.08)]" >
                {/* Icon */}
                <div className=" rounded-xl p-3 bg-[rgba(255,255,255,0.03)] border border-(--text-primary)/40" >
                    <Mail
                    size={20}
                    className="text-[#f59e0b]"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-medium text-(--text-primary)/60">
                    Sau khi thanh toán và checkout thành công,
                    </h1>

                    <p className="text-[17px] font-semibold text-(--text-primary) leading-relaxed">
                    chúng tôi sẽ gửi xác nhận đơn hàng{" "}
                    <span className="text-(--primary-color)">
                        về Gmail của bạn.
                    </span>
                    </p>
                </div>
            </div>
        </div>
     );
}

export default ContactInformationSection;