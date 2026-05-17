import { images } from "@/assets";
import { Send } from "lucide-react";
import CommentItem from "./components/CommentItem/CommentItem";
import { MOCK_COMMENTS } from "./data";

function EventComment() {
    return (  
        <div className="space-y-5">
            <h1 className="text-(--text-primary) text-xl">Comments (128)</h1>
            
            <div className="flex items-center gap-3">
                <img src={images.profile} alt="" className="object-cover w-18 h-18 rounded-4xl" />
                
                <input type="text" placeholder="Write a comment..."  className="p-3 text-(--text-primary) w-full rounded-xl border border-(--text-primary)/60"/>

                <button
                    className="p-4 rounded-xl bg-(--primary-color) disabled:opacity-30 hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    <Send size={20} color="white" />
                </button>
            </div>

            {MOCK_COMMENTS.map((comment) => (
                <CommentItem key={comment.id} comment={comment}/>
            ))}
        </div>
    );
}

export default EventComment;