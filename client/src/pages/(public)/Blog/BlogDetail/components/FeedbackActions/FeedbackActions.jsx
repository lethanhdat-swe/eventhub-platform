import { ThumbsDown, ThumbsUp } from "lucide-react";

function FeedbackActions() {
    return ( 
        <div className="flex items-center gap-10">
            <p className="text-(--text-primary)/70 text-xl">Bài viết này có hữu ích không?</p>

           <button className="text-(--primary-color) p-3 border-2 border-(--primary-color)/40 
                   flex items-center gap-3 rounded-2xl
                   transition-all duration-300
                   hover:bg-(--primary-color)/10
                   hover:border-(--primary-color)
                   hover:scale-105
                   active:scale-95">
            <ThumbsUp /> Hữu ích
            </button>

            <button className="text-(--primary-color) p-3 border-2 border-(--primary-color)/40 
                            flex items-center gap-3 rounded-2xl
                            transition-all duration-300
                            hover:bg-(--primary-color)/10
                            hover:border-(--primary-color)
                            hover:scale-105
                            active:scale-95">
            <ThumbsDown /> Chưa hữu ích
            </button>
        </div>
     );
}

export default FeedbackActions;