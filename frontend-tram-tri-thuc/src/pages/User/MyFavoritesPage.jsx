import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavorites } from "../../store/slices/userSlice";
import Pagination from "../../components/Common/Pagination";

const MyFavoritesPage = () => {
    const dispatch = useDispatch();
    const { favorites, pagination, loading, error } = useSelector((state) => state.user);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchUserFavorites({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleNextPage = () => {
        if (page < pagination.favorites.totalPages) {
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
            <h2 className="text-xl font-semibold mb-4">Tài liệu yêu thích</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : favorites.length > 0 ? (
                <>
                    <ul className="space-y-3">
                        {favorites.map((doc) => (
                            <li key={doc._id} className="p-4 border rounded shadow-sm">
                                <h3 className="text-lg font-semibold">{doc.title}</h3>
                                <p className="text-sm text-gray-500">Slug: {doc.slug}</p>
                            </li>
                        ))}
                    </ul>
                    <Pagination
                        page={page}
                        totalPages={pagination.favorites.totalPages}
                        onNext={handleNextPage}
                        onPrev={handlePrevPage}
                        onPageChange={handlePageChange}
                        isLoading={loading}
                    />
                </>
            ) : (
                <p className="text-gray-500">Không có tài liệu yêu thích nào.</p>
            )}
        </div>
    );
};

export default MyFavoritesPage;
