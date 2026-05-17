import CommentActions from "../CommentActions/CommentActions";
import CommentInfo from "../CommentInfo/CommentInfo";


function CommentItem({comment}) {
    return ( 
        <div
            className="
                flex items-start justify-between
                rounded-3xl border border-(--text-primary)/5
                bg-(--text-primary)/2
                backdrop-blur-xl
                p-4
                transition-all duration-300

                hover:border-(--primary-color)/20
                hover:bg-(--text-primary)/3
            "
            >
            <CommentInfo comment={comment}/>
            <CommentActions />
        </div>
     );
}

export default CommentItem;