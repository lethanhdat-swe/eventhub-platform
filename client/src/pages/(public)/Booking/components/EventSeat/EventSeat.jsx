import { useCallback, useState } from "react";
import Stage from "./components/Stage/Stage";
import Legend from "./components/Legend/Legend";
import SeatGrid from "./components/SeatGrid/SeatGrid";
import BookingPanel from "./components/BookingPanel/BookingPanel";
import { MAX_SEATS } from "@/constants/seatConfig";
import { fmt, seatPrice } from "@/utils/seatUtils";

function EventSeat() {
    const [selected, setSelected] = useState(new Set());
 
    const toggle = useCallback((id, row) => {
        setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
            next.delete(id);
        } else {
            if (next.size >= MAX_SEATS) {
            alert(`Tối đa ${MAX_SEATS} ghế mỗi lần đặt.`);
            return prev;
            }
            next.add(id);
        }
        return next;
        });
    }, []);
    
    const remove = useCallback((id, row) => {
        setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
        });
    }, []);
    
    const book = () => {
        const list = [...selected].sort().join(", ");
        alert(`Đặt chỗ thành công!\nGhế: ${list}\nTổng: ${fmt([...selected].reduce((s, id) => s + seatPrice(id[0]), 0))}`);
        setSelected(new Set());
    };
    
    return (
        <div className="grid grid-cols-12 gap-5">
            <div className="col-span-8 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10">
                <Stage />
                <Legend />
                <SeatGrid selected={selected} onToggle={toggle} />
            </div>
            <div className="col-span-4 bg-(--background-color)/90 border border-(--text-primary)/10 rounded-xl p-10">
                <BookingPanel selected={selected} onRemove={remove} onBook={book} />
            </div>
        </div>
    );
}

export default EventSeat;