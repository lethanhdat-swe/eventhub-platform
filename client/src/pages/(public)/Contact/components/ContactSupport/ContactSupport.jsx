import { images } from "@/assets";
import { Headphones, MessageSquareText, ShieldCheck } from "lucide-react";

function ContactSupport() {
    const SUPPORT_DATA = [
    {
        id: 1,
        Icon: MessageSquareText,
        title: "Phản hồi nhanh",
        description: "Chúng tôi phản hồi trong 24h",
    },
    {
        id: 2,
        Icon: Headphones,
        title: "Hỗ trợ tận tâm",
        description: "Đội ngũ chuyên nghiệp sẵn sàng hỗ trợ",
    },
    {
        id: 3,
        Icon: ShieldCheck,
        title: "Bảo mật thông tin",
        description: "Cam kết bảo mật tuyệt đối thông tin của bạn",
    },
    ];

    return ( 
        <div className="relative ">
            <img src={images.home} alt="" className="object-cover w-full h-70" />
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
            <div className="absolute flex items-center justify-between top-10 left-10 right-10">
                <div className="flex flex-col gap-5">
                    <p className="text-xl font-semibold text-(--primary-color) uppercase">bạn có thắc mắc?</p>
                    <p className="text-3xl text-white font-">
                        Chúng tôi ở đây để giúp bạn!
                    </p>
                    <p className="max-w-132.5 text-white/50">
                        Đừng ngần ngại liên hệ nếu bạn cần hổ trợ về sự kiện, vé, đối tác hoặc bất kỳ thông tin nào khác.
                    </p>
                </div>

               <div className="flex flex-wrap justify-center gap-10">
                    {SUPPORT_DATA.map((item) => (
                        <div key={item.id} className="flex flex-col items-center">
                        <item.Icon 
                            size={30} 
                            color="var(--primary-color)" 
                            className="mb-5" 
                        />
                        
                        <p className="mb-1 font-medium text-white capitalize">
                            {item.title}
                        </p>
                        
                        <p className="text-sm text-center text-white/70 max-w-45">
                            {item.description}
                        </p>
                        </div>
                    ))}
                </div>
           </div>
        </div>
     );
}

export default ContactSupport;