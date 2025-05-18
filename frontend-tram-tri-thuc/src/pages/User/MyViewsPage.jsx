import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserHistory } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyViewsPage = () => {
    const dispatch = useDispatch();
    const { history, pagination, loading, error } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchUserHistory({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleNextPage = () => {
        if (page < pagination.history.totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tài liệu đã xem gần đây</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : history.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {history.map((view) => (
                            <li key={view.documentId._id} className="p-2 border rounded">
                                {view.documentId.title} — {new Date(view.viewedAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={pagination.history.totalPages}
                        onNext={handleNextPage}
                        onPrev={handlePrevPage}
                        onPageChange={handlePageChange}
                        isLoading={loading}
                    />
                </>
            ) : (
                <p className="text-gray-500">Không có lịch sử xem.</p>
            )}
        </div>
    );
};

export default MyViewsPage;