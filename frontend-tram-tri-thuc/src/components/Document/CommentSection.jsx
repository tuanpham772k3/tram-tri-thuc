import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCommentLocal} from "../../store/slices/commentSlice";

export default function CommentSection({ documentId }) {
    const dispatch = useDispatch();
    const { byDocument, loading: commentLoading } = useSelector((state) => state.comment);
    const { list: users, loading: userLoading } = useSelector((state) => state.user);
    const comments = byDocument[documentId] || [];
    const [newComment, setNewComment] = useState("");

    // useEffect(() => {
    //     if (!byDocument[documentId]) {
    //         dispatch(fetchCommentsByDocument(documentId));
    //     }
    //     if (users.length === 0) {
    //         dispatch(fetchUsers());
    //     }
    // }, [dispatch, documentId, byDocument, users.length]);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            _id: `c${Date.now()}`, // Tạm thời tạo ID giả
            documentId,
            userId: "u1", // Giả sử user hiện tại là u1
            content: newComment,
            createdAt: new Date(),
            isDeleted: false,
            isApproved: true,
        };

        dispatch(addCommentLocal({ documentId, comment }));
        setNewComment("");
    };

    // Ánh xạ userId sang tên người dùng
    const getUserName = (userId) => {
        const user = users.find((u) => u._id === userId);
        return user ? user.name : "Ẩn danh";
    };

    if (commentLoading || userLoading) return <p>Đang tải bình luận...</p>;
    if (comments.length === 0)
        return (
            <div>
                <h4 className="font-semibold mb-2">💬 Bình luận</h4>
                <p className="text-gray-500">Chưa có bình luận nào.</p>
                <form onSubmit={handleAddComment} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                    <button
                        type="submit"
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Gửi
                    </button>
                </form>
            </div>
        );

    return (
        <div>
            <h4 className="font-semibold mb-2">💬 Bình luận</h4>
            {comments.map((comment) => (
                <div key={comment._id} className="border-b py-2">
                    <strong>{getUserName(comment.userId)}:</strong> {comment.content}
                    <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                    </p>
                </div>
            ))}
            <form onSubmit={handleAddComment} className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-2 border rounded"
                    rows="3"
                />
                <button
                    type="submit"
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Gửi
                </button>
            </form>
        </div>
    );
}
