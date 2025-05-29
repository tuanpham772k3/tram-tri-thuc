import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchViewedHistory } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyViewedHistory = () => {
    const dispatch = useDispatch();
    const { viewedHistory = [], pagination, loading, error } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Thêm limit

    useEffect(() => {
        console.log("Fetching viewed history with:", { page, limit });
        dispatch(fetchViewedHistory({ page, limit }));
    }, [dispatch, page, limit]);

    const handleNextPage = () => {
        if (page < (pagination.viewedHistory?.totalPages || 1)) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination.viewedHistory?.totalPages || 1)) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit) => {
        if (newLimit > 0) {
            setLimit(newLimit);
            setPage(1); // Reset về trang 1
        }
    };

    console.log("Viewed history state:", { viewedHistory, loading, error }); // Debug

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tài liệu đã xem gần đây</h2>
            {loading ? (
                <div className="space-y-2">
                    {Array(5)
                        .fill()
                        .map((_, i) => (
                            <div key={i} className="p-2 border rounded animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : viewedHistory.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {viewedHistory.map((view) => (
                            <li key={view.documentId?._id} className="p-2 border rounded">
                                {view.documentId ? (
                                    <>
                                        {view.documentId.title} —{" "}
                                        {new Date(view.viewedAt).toLocaleString("vi-VN", {
                                            dateStyle: "short",
                                            timeStyle: "short",
                                        })}
                                    </>
                                ) : (
                                    <span className="text-gray-500">
                                        Tài liệu không còn tồn tại
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={pagination.viewedHistory?.totalPages || 1}
                        onNext={handleNextPage}
                        onPrev={handlePrevPage}
                        onPageChange={handlePageChange}
                        onLimitChange={handleLimitChange}
                        limit={limit}
                        isLoading={loading}
                    />
                </>
            ) : (
                <p className="text-gray-500 flex flex-col items-center">
                    <img src="/empty-history.svg" alt="Empty" className="w-24 h-24 mb-2" />
                    Bạn chưa xem tài liệu nào cả 😢 <br />
                    Hãy khám phá ngay nào!
                </p>
            )}
        </div>
    );
};

export default MyViewedHistory;
