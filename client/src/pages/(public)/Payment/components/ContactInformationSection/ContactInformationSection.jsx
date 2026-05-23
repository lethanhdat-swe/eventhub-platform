import { Contact, Mail, Phone } from "lucide-react";

function ContactInformationSection({ customerInfo }) {
    const email = customerInfo?.email || 'Chưa cập nhật';
    const phone = customerInfo?.phone || 'Chưa cập nhật';

    return ( 
        <div>
             <div className="flex items-center gap-2 mt-6 mb-3">
                <Contact color="var(--primary-color)" size={20}/>
                <p className="text-(--text-primary) font-medium">Thông tin liên hệ</p> 
            </div>

            <div className="grid grid-cols-2 gap-5">
               <div className="flex items-center gap-3 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-4">
                    <div className="rounded-lg p-3 bg-(--surface-color)/60 border border-(--text-primary)/10">
                        <Mail color="var(--text-primary)" size={18} />
                    </div>
                    <div className="flex flex-col items-start gap-1 ">
                        <h2 className="text-(--text-primary)/60 font-medium text-sm">Email</h2>
                        <p className="text-(--text-primary)">{email}</p>
                    </div>
               </div>

               <div className="flex items-center gap-3 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-4">
                    <div className="rounded-lg p-3 bg-(--surface-color)/60 border border-(--text-primary)/10">
                        <Phone color="var(--text-primary)" size={18} />
                    </div>
                    <div className="flex flex-col items-start gap-1 ">
                        <h2 className="text-(--text-primary)/60 font-medium text-sm">Số điện thoại</h2>
                        <p className="text-(--text-primary)">{phone}</p>
                    </div>
               </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 px-4 py-3" >
                <div className="rounded-lg p-2 bg-(--surface-color)/60 border border-(--text-primary)/10" >
                    <Mail
                    size={16}
                    className="text-[#f59e0b]"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-(--text-primary)">
                        Email xác nhận sẽ được gửi sau khi thanh toán thành công.
                    </p>
                </div>
            </div>
        </div>
     );
}

export default ContactInformationSection;