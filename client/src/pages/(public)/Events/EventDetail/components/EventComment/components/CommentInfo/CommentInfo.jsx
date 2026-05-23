import { images } from "@/assets";
function CommentInfo({ comment }) {
    return (
        <div className="flex items-start gap-4">
            <img
                src={comment.user?.avatar ?? images.profile}
                alt=""
                className="object-cover w-16 h-16 rounded-full ring-2 ring-(--primary-color)/20"
            />

            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-(--text-primary) text-lg font-semibold">
                        {comment.user?.name ?? 'Anonymous'}
                    </h1>

                    <span className="text-(--text-primary)/40 text-sm">
                         {new Date(comment.createdAt).toLocaleString('vi-VN')}
                    </span>
                </div>

                <p className="text-(--text-primary)/80 leading-relaxed">
                    {comment.content}
                </p>

                <div className="flex items-center gap-6 pt-1">
                    <button className="text-(--text-primary)/60 text-sm transition-all duration-300 hover:text-(--primary-color)">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommentInfo;