import { Clock, Mail, MapPin, Phone, User } from "lucide-react";

function ContactInfo() {
    const contactInfo = [
    {
        id: 1,
        icon: MapPin,
        title: "Địa chỉ",
        lines: [
            "123 Đường Nguyễn Huệ, Quận 1,",
            "TP. Hồ Chí Minh, Việt Nam",
        ],
    },
    {
        id: 2,
        icon: Phone,
        title: "Hotline",
        lines: [
            "1900 1234",
            "(8:00 - 22:00 mỗi ngày)",
        ],
    },
    {
        id: 3,
        icon: Mail,
        title: "Email hỗ trợ",
        lines: [
            "support@eventhub.vn",
        ],
    },
    {
        id: 4,
        icon: Clock,
        title: "Giờ làm việc",
        lines: [
            "Thứ 2 - Chủ nhật",
            "08:00 - 22:00 (kể cả ngày lễ)",
        ],
    },
];

    return ( 
        <div className="py-1 px-6 border-l border-(--text-primary)/20">
            <div className="flex items-center gap-3">
                <User size={20} color="var(--primary-color)" />
                <h1 className="uppercase text-(--text-primary) font-medium text-xl">thông tin liên hệ</h1>
            </div>

            <div className="flex flex-col gap-8 mt-8">
                {contactInfo.map(({ id, icon: Icon, title, lines }) => (
                    <div key={id} className="flex items-start gap-4 group">
                        <div className="p-3 rounded-lg border border-(--primary-color)/30 text-(--primary-color) transition-all duration-300 group-hover:bg-(--primary-color)/10 group-hover:border-(--primary-color)/60 group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.2)]">
                            <Icon size={20} className="transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-(--text-primary) font-medium transition-colors duration-300 group-hover:text-(--primary-color)">{title}</p>
                            {lines.map((line, i) => (
                                <p key={i} className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{line}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-5 mt-15">
                <h1 className="text-(--text-primary) text-xl uppercase">tìm đường đến chúng tôi</h1>

                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62708.56631172282!2d106.62451104863281!3d10.789439900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b545b5903b%3A0x2381a6fe3f690419!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCBWaeG7hW4gdGjDtG5nIEPGoSBz4bufIHThuqFpIFRQLiBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1778253846145!5m2!1svi!2s"
                    width="100%"
                    height="350"
                    style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)", display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
     );
}

export default ContactInfo;