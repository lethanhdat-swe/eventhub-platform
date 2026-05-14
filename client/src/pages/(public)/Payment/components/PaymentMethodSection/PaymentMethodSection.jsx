import { Info } from "lucide-react";

function PaymentMethodSection() {
    return (
        <div className="bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10">
            <div className="flex flex-col gap-4 border-b pb-4 border-(--text-primary)/20">
                <div className="flex items-center justify-between text-(--text-primary)/60 text-xl">
                    <p>Tạm tính</p>
                    <p>4.000.000đ</p>
                </div>

                <div className="flex items-center justify-between text-(--text-primary)/60 text-xl">
                    <p className="flex items-center gap-2">Phí dịch vụ <Info /></p>
                    <p>200.000đ</p>
                </div>

                <div className="flex items-center justify-between text-(--text-primary)/60 text-xl">
                    <p className="uppercase">Vat (8%)</p>
                    <p>366.000đ</p>
                </div>
            </div>

            <div className="flex items-start justify-between mt-5">
                <div className="flex flex-col items-start gap-3">
                    <h1 className="text-(--text-primary) text-xl">Tổng số tiền thanh toán</h1>
                    <p className="text-(--text-primary)/60 text-[18px]">Đã bao gồm VAT và phí dịch vụ</p>
                </div>

                <p className="text-(--primary-color) text-3xl">4.536.000đ</p>
            </div>
        </div>
      );
}

export default PaymentMethodSection;