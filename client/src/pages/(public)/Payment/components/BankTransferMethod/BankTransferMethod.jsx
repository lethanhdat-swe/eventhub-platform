import { Banknote, Landmark } from "lucide-react";
import { useState } from "react";

function BankTransferMethod() {
     const [selected, setSelected] = useState(true);
    return ( 
        <div>
            <div className="flex items-center gap-3 mt-10 mb-5">
                <Banknote color="var(--primary-color)"size={24}/>
                <p className="text-(--text-primary) text-xl font-medium">Phương thức thanh toán</p> 
            </div>

             <button
                onClick={() => setSelected(!selected)}
                className={`
                    w-full rounded-xl p-5 transition-all duration-300
                    border bg-(--background-color)/90
                    ${
                    selected
                        ? "border-(--primary-color) shadow-[0_0_30px_color-mix(in_srgb,var(--primary-color)_25%,transparent)]"
                        : "border-(--text-primary)/10 hover:border-(--primary-color)/40"
                    }
                `}
                >
                <div className="flex items-center justify-between gap-6">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl p-4 bg-(--surface-color)/60 border border-(--text-primary)/40">
                            <Landmark color="var(--text-primary)" />
                        </div>

                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-(--text-primary) font-semibold text-lg">
                                    Thanh toán qua ngân hàng
                                </h1>

                                <p
                                    className="text-xs px-2 py-0.5 rounded-sm uppercase border text-center shrink-0"
                                    style={{
                                    color: "var(--primary-color)",
                                    backgroundColor:
                                        "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                                    borderColor:
                                        "color-mix(in srgb, var(--primary-color) 30%, transparent)",
                                    }}
                                >
                                    Khuyến nghị
                                </p>
                            </div>

                            <p className="text-(--text-primary)/60 text-sm">
                            Chuyển khoản qua QR code hoặc số tài khoản
                            </p>
                        </div>
                    </div>

                    {/* Right Radio */}
                    <div
                        className={`
                            relative w-7 h-7 rounded-full border transition-all duration-300
                            flex items-center justify-center
                            ${
                            selected
                                ? "border-(--primary-color)"
                                : "border-(--text-primary)/20"
                            }
                        `}
                        >
                        <div
                            className={`
                            w-3.5 h-3.5 rounded-full transition-all duration-300
                            ${
                                selected
                                ? "bg-(--primary-color) shadow-[0_0_15px_var(--primary-color)]"
                                : "bg-transparent"
                            }
                            `}
                        />
                    </div>
                </div>
                </button>
       </div>
     );
}

export default BankTransferMethod;