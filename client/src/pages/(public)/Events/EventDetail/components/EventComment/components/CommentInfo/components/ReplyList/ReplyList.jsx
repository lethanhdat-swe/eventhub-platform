import ReplyItem from "../ReplyItem/ReplyItem";

function ReplyList(props) {
    const { replies = [] } = props;

    if (!replies.length) return null;

    return (
        <div className="mt-5 ml-6 border-l border-(--text-primary)/10 pl-5 space-y-5">
            {replies.map((reply) => (
                <ReplyItem
                    key={reply.id}
                    reply={reply}
                    {...props}
                />
            ))}
        </div>
    );
}

export default ReplyList;