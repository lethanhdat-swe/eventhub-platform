import { images } from "@/assets";
import { ThumbsUp } from "lucide-react";

function CommentInfo ({comment}) {
    return ( <div className="flex items-start gap-4">
                <img
                src={images.profile}
                alt=""
                className="object-cover w-16 h-16 rounded-full ring-2 ring-(--primary-color)/20"
                />

                <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-(--text-primary) text-lg font-semibold">
                    {comment.name}
                    </h1>

                    <span className="text-(--text-primary)/40 text-sm">
                   {comment.time}
                    </span>
                </div>

                <p className="text-(--text-primary)/80 leading-relaxed">
                    {comment.text}
                </p>

                <div className="flex items-center gap-6 pt-1">
                    <button
                    className="
                        text-(--text-primary)/60 text-sm
                        transition-all duration-300

                        hover:text-(--primary-color)
                    "
                    >
                    Reply
                    </button>

                    <button
                    className="
                        flex items-center gap-2
                        text-(--primary-color)
                        transition-all duration-300

                        hover:scale-105
                        hover:text-(--primary-color)
                    "
                    >
                    <ThumbsUp size={18} />
                    <p className="text-sm">{comment.likes}</p>
                    </button>
                </div>
            </div>
            </div> );
}

export default CommentInfo;