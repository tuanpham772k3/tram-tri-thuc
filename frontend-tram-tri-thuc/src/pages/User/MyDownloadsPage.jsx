import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDownloads } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyDownloadsPage = () => {
    const dispatch = useDispatch();
    const { downloads, pagination, loading, error } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchUserDownloads({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleNextPage = () => {
        if (page < pagination.downloads.totalPages) {
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
            <h2 className="text-xl font-semibold mb-4">Lịch sử tải xuống</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : downloads.length > 0 ? (
                <>
                    <ul className="space-y-2">
                        {downloads.map((d) => (
                            <li key={d.documentId._id} className="p-2 border rounded">
                                {d.documentId.title} —{" "}
                                {new Date(d.downloadedAt).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={pagination.downloads.totalPages}
                        onNext={handleNextPage}
                        onPrev={handlePrevPage}
                        onPageChange={handlePageChange}
                        isLoading={loading}
                    />
                </>
            ) : (
                <p className="text-gray-500">Không có lịch sử tải xuống.</p>
            )}
        </div>
    );
};

export default MyDownloadsPage;
