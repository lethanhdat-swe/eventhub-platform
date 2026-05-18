import { Bookmark } from "lucide-react";

function SavedEventsHero() {
    return ( 
        <div className="mb-5">
            <div className="flex items-center gap-2">
                <h1 className="text-(--text-primary) text-3xl">Đã lưu </h1>
                <Bookmark color="var(--primary-color)"/> 
            </div>
            <p className="text-(--text-primary)/60">Quản lý những sự kiện bạn quan tâm và không muốn bỏ lỡ</p>
        </div>
     );
}

export default SavedEventsHero;