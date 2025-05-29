import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteDocuments } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyFavoritesDocuments = () => {
    const dispatch = useDispatch();
    const {
        favoriteDocuments = [],
        pagination,
        loading,
        error,
    } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Thêm limit

    useEffect(() => {
        console.log("Fetching favorites with:", { page, limit }); // Debug
        dispatch(fetchFavoriteDocuments({ page, limit }));
    }, [dispatch, page, limit]);

    const handleNextPage = () => {
        if (page < (pagination.favoriteDocuments?.totalPages || 1)) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= (pagination.favoriteDocuments?.totalPages || 1)) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit) => {
        if (newLimit > 0) {
            setLimit(newLimit);
            setPage(1); // Reset về trang 1
        }
    };

    console.log("Favorites state:", { favoriteDocuments, loading, error }); // Debug

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Tài liệu yêu thích</h2>
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
            ) : favoriteDocuments.length > 0 ? (
                <>
                    <ul className="space-y-3">
                        {favoriteDocuments.map((doc) => (
                            <li key={doc._id} className="p-4 border rounded shadow-sm">
                                <h3 className="text-lg font-semibold">{doc.title}</h3>
                                <p className="text-sm text-gray-500">Slug: {doc.slug}</p>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={pagination.favoriteDocuments.totalPages}
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
                    <img src="/empty-heart.svg" alt="Empty" className="w-24 h-24 mb-2" />
                    Bạn chưa "thả tim" tài liệu nào cả 😢 <br />
                    Hãy khám phá và thêm vào danh sách yêu thích nhé!
                </p>
            )}
        </div>
    );
};

export default MyFavoritesDocuments;
