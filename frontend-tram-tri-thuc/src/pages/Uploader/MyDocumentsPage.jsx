// frontend/src/pages/MyDocumentsPage.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, deleteDocument, fetchMyDocuments } from "../../store/slices/documentSlice";
import showToast from "../../utils/toast";

export default function MyDocumentsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myDocuments, loading, error } = useSelector((state) => state.documents);
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            showToast("error", "Vui lòng đăng nhập để xem tài liệu.");
            navigate("/auth/login");
        } else if (!userInfo || !["uploader", "admin"].includes(userInfo.role)) {
            showToast("error", "Bạn cần quyền uploader để truy cập.");
            navigate("/");
        } else {
            dispatch(fetchMyDocuments());
        }
        return () => dispatch(clearError()); // Xóa lỗi khi unmount
    }, [dispatch, navigate, userInfo]);

    useEffect(() => {
        if (error) {
            showToast(
                "error",
                error === "Không thể lấy danh sách tài liệu cá nhân"
                    ? "Lỗi khi tải tài liệu. Vui lòng kiểm tra quyền truy cập hoặc đăng nhập lại."
                    : error
            );
        }
    }, [error]);

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa tài liệu này?")) {
            dispatch(deleteDocument(id))
                .unwrap()
                .then(() => showToast("success", "Xóa tài liệu thành công!"))
                .catch((err) => showToast("error", err || "Lỗi khi xóa tài liệu."));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Tài liệu của tôi</h1>
            {loading && <p>Đang tải...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {myDocuments.length > 0 ? (
                <ul className="space-y-3">
                    {myDocuments.map((doc) => (
                        <li key={doc._id} className="p-4 border rounded shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold">{doc.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Đăng ngày: {new Date(doc.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                        Trạng thái:{" "}
                                        {doc.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/edit-document/${doc._id}`}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Chỉnh sửa
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(doc._id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">Không có tài liệu nào để hiển thị.</p>
            )}
        </div>
    );
}
