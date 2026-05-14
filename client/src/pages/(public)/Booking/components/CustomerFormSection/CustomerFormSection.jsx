import { Mail, Phone, User } from "lucide-react";

function CustomerFormSection() {
    return ( 
        <div className="col-span-8 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10 space-y-5">
            <p className="text-(--text-primary) uppercase text-xl">thông tin người đặt vé</p>

            <div className="grid grid-cols-3 gap-15 ">
                <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4">
                <div className="space-y-2">
                    <p className="text-(--text-primary)/70">Họ và tên</p>
                    <p className="text-(--text-primary)">Nguyễn Văn A</p>
                </div>
                <User color="var(--text-primary)" /> 
            </div>

            <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4">
                <div className="space-y-2">
                    <p className="text-(--text-primary)/70">Email</p>
                    <p className="text-(--text-primary)">nguyenvan@gmail.com</p>
                </div>
                <Mail color="var(--text-primary)" /> 
            </div>

            <div className="flex items-center justify-between border border-(--text-primary)/10 rounded-xl p-4">
                <div className="space-y-2">
                    <p className="text-(--text-primary)/70">Số điên thoại</p>
                    <p className="text-(--text-primary)">01231312312</p>
                </div>
                <Phone color="var(--text-primary)" /> 
            </div>
            </div>
        </div>
     );
}

export default CustomerFormSection;