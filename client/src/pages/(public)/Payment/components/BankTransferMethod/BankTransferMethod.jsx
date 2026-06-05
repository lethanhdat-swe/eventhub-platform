import { Banknote, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatCurrency(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function BankTransferMethod({ paymentInfo }) {
    return ( 
        <div>
            <div className="flex items-center gap-2 mt-6 mb-3">
                <Banknote color="var(--primary-color)" size={20}/>
                <p className="text-(--text-primary) font-medium">Phương thức thanh toán</p> 
            </div>

             <div className="w-full rounded-xl border border-(--text-primary)/10 bg-(--background-color)/90 p-4">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl p-3 bg-(--surface-color)/60 border border-(--text-primary)/10">
                            <Landmark color="var(--text-primary)" size={20} />
                        </div>

                        <div className="flex flex-col items-start gap-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-(--text-primary) font-semibold">
                                    Thanh toán qua ngân hàng
                                </h2>

                                <Badge variant="outline" className="text-(--primary-color)">
                                    SEPAY
                                </Badge>
                            </div>

                            <p className="text-(--text-primary)/60 text-sm">
                                Chuyển khoản bằng mã QR hoặc thông tin tài khoản
                            </p>
                        </div>
                    </div>
                </div>

                {paymentInfo ? (
                    <div className="mt-4 grid gap-3 rounded-lg border border-(--text-primary)/10 bg-(--surface-color)/30 p-4 text-sm md:grid-cols-3">
                        <div>
                            <p className="text-(--text-primary)/50">Mã đơn hàng</p>
                            <p className="font-semibold text-(--text-primary)">
                                {paymentInfo.orderCode}
                            </p>
                        </div>
                        <div>
                            <p className="text-(--text-primary)/50">Số tiền</p>
                            <p className="font-semibold text-(--text-primary)">
                                {formatCurrency(paymentInfo.amount)}
                            </p>
                        </div>
                        {paymentInfo.paymentUrl ? (
                            <a
                                href={paymentInfo.paymentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-semibold text-(--primary-color) hover:underline"
                            >
                                Mở trang thanh toán SEPAY
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </div>
       </div>
     );
}

export default BankTransferMethod;