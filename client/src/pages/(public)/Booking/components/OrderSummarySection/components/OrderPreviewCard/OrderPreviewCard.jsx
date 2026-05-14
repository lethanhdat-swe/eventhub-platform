import { images } from "@/assets";
import { Calendar, MapPin } from "lucide-react";

function OrderPreviewCard() {
    return (
          <div className="grid grid-cols-12 gap-4 border-r border-(--text-primary)/20">
                    <div className="col-span-4">
                        <img src={images.home} alt="" className="object-cover h-full rounded-xl"/>
                    </div>

                    <div className="col-span-8">
                        <div className="flex flex-col items-start gap-2 mb-8">
                            <p className="text-(--text-primary) text-[14px] font-bold tracking-tight">
                                NEON MUSIC FESTIVAL 2026
                            </p>
                            <p
                                className="text-xs px-2 py-0.5 rounded-sm uppercase border text-center shrink-0"
                                style={{
                                color: "var(--primary-color)",
                                backgroundColor: "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                                borderColor: "color-mix(in srgb, var(--primary-color) 30%, transparent)",
                                }}
                            >
                                Music festival
                            </p>
                        </div>

                         <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                             <Calendar
                                    color="var(--text-primary)"
                                    className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                />
                            <div className="flex items-center gap-2 text-(--text-primary)/60">
                                <p>20 - 21/06/2026</p>
                                <p className=" border-l border-(--text-primary)/30 pl-2">16:00 - 23:00</p>
                            </div>
                         </div>

                          <div className="flex items-center gap-4 group">
                             <MapPin
                                    color="var(--text-primary)"
                                    className="mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                />
                            <div className="flex items-center gap-2 text-(--text-primary)/60">
                                <p>Đa Phước, Bình Chánh, TP.HCM</p>
                            </div>
                         </div>
                         </div>
                    </div>
                </div>

      );
}

export default OrderPreviewCard;