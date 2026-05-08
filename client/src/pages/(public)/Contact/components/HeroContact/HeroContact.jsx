import { images } from "@/assets";

function HeroContact() {
    return ( 
        <div className="relative">
            <img src={images.home} alt="" className="object-cover w-full h-70" />
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/20" />
            <div className="container absolute flex items-center justify-between top-10 left-10 right-10">
            <div className="flex flex-col gap-5">
                <h1 className="text-5xl font-semibold text-white uppercase">
                    Liên hệ với </h1>
                <h1 className="text-5xl font-semibold text-(--primary-color) uppercase">
                    eventhub
                </h1>
                <div className="text-sm leading-relaxed text-white/70 max-w-120">
                    <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
                    <p>Hãy gửi cho chúng tôi thông tin, đội ngũ sẽ phản hồi lại sớm nhất!</p>
                </div>
            </div>
            </div>
        </div>
     );
}

export default HeroContact;