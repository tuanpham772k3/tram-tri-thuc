import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDownloadedHistory } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyDownloadedHistory = () => {
    const dispatch = useDispatch();
    const { downloadedHistory, pagination, loading, error } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Thêm state limit

    useEffect(() => {
        console.log("Fetching downloaded history with:", { page, limit }); // Debug
        dispatch(fetchDownloadedHistory({ page, limit }));
    }, [dispatch, page, limit]);

    const handleNextPage = () => {
        if (page < (pagination.downloadedHistory?.totalPages || 1)) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination.downloadedHistory?.totalPages || 1)) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit) => {
        if (newLimit > 0) {
            setLimit(newLimit);
            setPage(1);
        }
    };

    console.log("Downloaded history state:", { downloadedHistory, loading, error }); // Debug

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Lịch sử tải xuống</h2>
            {loading ? (
                <div className="space-y-2">
                    {/* Skeleton UI */}
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
            ) : downloadedHistory.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {downloadedHistory.map((d) => (
                            <li key={d.documentId?._id} className="p-2 border rounded">
                                {d.documentId ? (
                                    <>
                                        {d.documentId.title} —{" "}
                                        {new Date(d.downloadedAt).toLocaleString("vi-VN", {
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
                        totalPages={pagination.downloadedHistory?.totalPages || 1}
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
                    <img src="/empty-download.svg" alt="Empty" className="w-24 h-24 mb-2" />
                    Bạn chưa tải tài liệu nào cả 😢 <br />
                    Hãy tìm và tải ngay nào!
                </p>
            )}
        </div>
    );
};

export default MyDownloadedHistory;
