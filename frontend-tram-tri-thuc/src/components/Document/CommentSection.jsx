import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCommentsByDocument,
    createComment,
    updateComment,
    deleteComment,
    reportComment,
    retryCommentAction,
    clearCommentError,
} from "../../store/slices/commentSlice";
import showToast from "../../utils/toast";
import { useNavigate } from "react-router-dom";

export default function CommentSection({ documentId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { comments, loading, error, currentPage, totalPages } = useSelector(
        (state) => state.comments
    );
    const { userInfo } = useSelector((state) => state.user);
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editContent, setEditContent] = useState("");

    // Lấy danh sách bình luận khi component mount hoặc documentId thay đổi
    useEffect(() => {
        if (documentId) {
            dispatch(fetchCommentsByDocument({ documentId, params: { page: currentPage } }));
        }
        return () => {
            dispatch(clearCommentError());
        };
    }, [dispatch, documentId, currentPage]);

    // Xử lý lỗi
    useEffect(() => {
        if (error) {
            showToast("error", error.message);
        }
    }, [error]);

    // Gửi bình luận mới
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            showToast("error", "Bình luận không được để trống.");
            return;
        }
        if (newComment.length > 500) {
            showToast("error", "Bình luận không được vượt quá 500 ký tự.");
            return;
        }
        if (!userInfo) {
            showToast("error", "Vui lòng đăng nhập để bình luận.");
            return;
        }
        if (!localStorage.getItem("token")) {
            showToast("error", "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            dispatch({ type: "user/logout" });
            navigate("/auth/login");
            return;
        }

        try {
            console.log("Sending comment:", newComment);
            await dispatch(createComment({ documentId, content: newComment })).unwrap();
            setNewComment("");
        } catch (err) {
            // Lỗi đã được xử lý trong thunk và showToast
        }
    };

    // Gửi phản hồi (reply)
    const handleReply = async (parentCommentId) => {
        const content = replyContent[parentCommentId]?.trim();
        if (!content) {
            showToast("error", "Phản hồi không được để trống.");
            return;
        }
        if (!userInfo) {
            showToast("error", "Vui lòng đăng nhập để phản hồi.");
            return;
        }

        try {
            await dispatch(createComment({ documentId, content, parentCommentId })).unwrap();
            setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" }));
        } catch (err) {
            // Lỗi đã được xử lý trong thunk và showToast
        }
    };

    // Cập nhật bình luận
    const handleUpdateComment = async (commentId) => {
        if (!editContent.trim()) {
            showToast("error", "Bình luận không được để trống.");
            return;
        }
        try {
            await dispatch(updateComment({ commentId, content: editContent })).unwrap();
            setEditingComment(null);
            setEditContent("");
        } catch (err) {
            // Lỗi đã được xử lý trong thunk và showToast
        }
    };

    // Xóa bình luận
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
        try {
            await dispatch(deleteComment(commentId)).unwrap();
        } catch (err) {
            // Lỗi đã được xử lý trong thunk và showToast
        }
    };

    // Báo cáo bình luận
    const handleReportComment = async (commentId) => {
        if (!window.confirm("Bạn có muốn báo cáo bình luận này vì vi phạm?")) return;
        try {
            await dispatch(reportComment(commentId)).unwrap();
        } catch (err) {
            // Lỗi đã được xử lý trong thunk và showToast
        }
    };

    // Retry khi gặp lỗi
    const handleRetry = () => {
        dispatch(
            retryCommentAction({
                action: fetchCommentsByDocument,
                payload: { documentId, params: { page: currentPage } },
            })
        );
    };

    // Render bình luận và replies
    const renderComment = (comment, level = 0) => {
        const isEditing = editingComment === comment._id;
        const canEditOrDelete =
            userInfo && (userInfo._id === comment.userId || userInfo.role === "admin");

        return (
            <div
                key={comment._id}
                className={`border-b py-2 ${level > 0 ? "ml-6" : ""}`}
                style={{ marginLeft: `${level * 1.5}rem` }}
            >
                {isEditing ? (
                    <div>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border rounded"
                            rows="2"
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => handleUpdateComment(comment._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setEditingComment(null)}
                                className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <strong>{comment.user?.name || "Ẩn danh"}:</strong>{" "}
                                {comment.content}
                                <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                    {comment.isEdited && " (Đã chỉnh sửa)"}
                                    {comment.isReported && (
                                        <span className="text-red-500"> (Đã báo cáo)</span>
                                    )}
                                </p>
                            </div>
                            {userInfo && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            setReplyContent({
                                                ...replyContent,
                                                [comment._id]: replyContent[comment._id] || "",
                                            })
                                        }
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Phản hồi
                                    </button>
                                    {canEditOrDelete && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditingComment(comment._id);
                                                    setEditContent(comment.content);
                                                }}
                                                className="text-yellow-600 hover:underline text-sm"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="text-red-600 hover:underline text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                    {!canEditOrDelete && (
                                        <button
                                            onClick={() => handleReportComment(comment._id)}
                                            className="text-orange-600 hover:underline text-sm"
                                            disabled={comment.isReported}
                                        >
                                            Báo cáo
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        {replyContent[comment._id] !== undefined && (
                            <div className="mt-2">
                                <textarea
                                    value={replyContent[comment._id]}
                                    onChange={(e) =>
                                        setReplyContent({
                                            ...replyContent,
                                            [comment._id]: e.target.value,
                                        })
                                    }
                                    placeholder="Viết phản hồi của bạn..."
                                    className="w-full p-2 border rounded"
                                    rows="2"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleReply(comment._id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Gửi
                                    </button>
                                    <button
                                        onClick={() =>
                                            setReplyContent((prev) => ({
                                                ...prev,
                                                [comment._id]: undefined,
                                            }))
                                        }
                                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {comment.replies?.map((reply) => renderComment(reply, level + 1))}
            </div>
        );
    };

    if (loading) {
        return <p className="text-center">Đang tải bình luận...</p>;
    }

    if (error) {
        return (
            <div className="text-center">
                <p className="text-red-500">{error.message}</p>
                <button
                    onClick={handleRetry}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            <h4 className="font-semibold mb-2">💬 Bình luận ({comments.length})</h4>
            {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
            ) : (
                comments.map((comment) => renderComment(comment))
            )}
            <form onSubmit={handleAddComment} className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Viết bình luận của bạn..."
                    className="w-full p-2 border rounded"
                    rows="3"
                    disabled={!userInfo}
                />
                <button
                    type="submit"
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={!userInfo || loading}
                >
                    Gửi
                </button>
                {!userInfo && (
                    <p className="text-sm text-gray-500 mt-1">Vui lòng đăng nhập để bình luận.</p>
                )}
            </form>
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        onClick={() =>
                            dispatch(
                                fetchCommentsByDocument({
                                    documentId,
                                    params: { page: currentPage - 1 },
                                })
                            )
                        }
                        disabled={currentPage === 1 || loading}
                        className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-300"
                    >
                        Trước
                    </button>
                    <span>
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            dispatch(
                                fetchCommentsByDocument({
                                    documentId,
                                    params: { page: currentPage + 1 },
                                })
                            )
                        }
                        disabled={currentPage === totalPages || loading}
                        className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-300"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}
