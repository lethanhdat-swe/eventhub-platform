import { CircleCheck, Dot } from "lucide-react";

function CheckInHero() {
    return ( 
        <div className="flex flex-col items-center gap-4">
            <p className="text-(--text-primary) text-4xl font-semibold">Sẵn sàng check-in</p>
            <p className="text-(--text-primary)/60">Đưa mã QR này cho nhân viên tại sư kiện để check-in</p>

            <div className="flex items-center gap-3 p-3 border border-(--text-primary)/40 rounded-xl">
                <div className="flex items-center gap-3 text-green-500">
                    <CircleCheck />
                    <p>Vé hợp lệ</p> 
                </div>

                <div className="flex items-center gap-2 text-(--text-primary)/60"> 
                    <Dot /> 
                    <p>Hẹn gặp lại tại sự kiện</p>
                </div>
            </div>
        </div>
     );
}

export default CheckInHero;