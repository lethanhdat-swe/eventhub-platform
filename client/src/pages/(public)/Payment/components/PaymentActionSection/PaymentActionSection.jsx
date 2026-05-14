import { LockKeyhole, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";

function PaymentActionSection() {
    return ( 
        <div className="grid grid-cols-2 gap-6 mt-10 mb-5">
        {/* Back Button */}
        <Link
            to={"/booking"}
            className="group relative overflow-hidden rounded-2xl border border-(--text-primary)/10 bg-(--text-primary)/3 px-6 py-5 flex items-center justify-center gap-4 backdrop-blur-xl transition-all duration-300 hover:border-(--text-primary)/20 hover:bg-(--text-primary)/5 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.05)]">
            {/* Glow */}
            <div
                className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-linear-to-r from-(--text-primary)/5 to-transparent group-hover:opacity-100"
            />

            <Undo2
                size={24}
                className="transition-all duration-300 text-(--text-primary)/90 group-hover:-translate-x-1"
            />
            <p className="text-xl font-semibold text-(--text-primary) transition-all duration-300 ">Quay lại</p>
        </Link>

        {/* Pay Button */}
        <Link
            to={"/"}
            className="group relative overflow-hidden rounded-2xl px-6 py-5 flex items-center justify-center gap-4
            bg-linear-to-r
            from-purple-600
            via-fuchsia-500
            to-purple-500 transition-all duration-300 hover:scale-[1.02]
            hover:-translate-y-1
            hover:shadow-[0_0_45px_rgba(168,85,247,0.55)]
            "
        >
            {/* Animated Glow */}
            <div
            className="
                absolute inset-0
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
                bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)]
            "
            />

            {/* Shine Effect */}
            <div
            className="
                absolute inset-y-0 left-[-120%] w-30
                rotate-12 bg-(--text-primary)/20 blur-2xl
                transition-all duration-700
                group-hover:left-[120%]
            "
            />

            <p
            className="relative z-10 text-xl font-bold tracking-wide text-(--text-primary) "
            >
            Thanh toán ngay
            </p>

            <LockKeyhole
            size={24}
            className="relative z-10 text-(--text-primary) transition-transform duration-300 group-hover:scale-110"
            />
        </Link>
        </div>
            );
}

export default PaymentActionSection;