import {
    JCBIcon,
    MastercardIcon,
    PaypalIcon,
    SepayIcon,
    VisaIcon,
} from "@/assets/icons";
import { Copyright } from "lucide-react";

function PaymentMethods() {
    return (
        <div className="mt-6 border-t-2 border-[#29282a]">
            <div className="flex items-center justify-between gap-2 pt-6">
                <div className="flex items-center gap-2 ">
                    <Copyright color="white" />
                    <p className="text-(--text-primary)">
                        2026 EventHub. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <VisaIcon size={40} />
                    <MastercardIcon size={40} />
                    <PaypalIcon size={40} />
                    <JCBIcon size={40} />
                    <SepayIcon size={40} />
                </div>
            </div>
        </div>
    );
}

export default PaymentMethods;
