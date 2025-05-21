// frontend/src/components/Document/DocumentList.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../../store/slices/documentSlice";
import Pagination from "../Common/Pagination";
import DocumentCard from "./DocumentCard"

export default function DocumentList({ categorySlug = null, type = null }) {
    const dispatch = useDispatch();
    const { documents, loading, error, pagination } = useSelector((state) => state.documents);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: "",
        category: categorySlug || "",
        sort: "date",
        isFeatured: type === "featured" ? true : undefined,
    });

    useEffect(() => {
        dispatch(fetchDocuments(filters));
    }, [dispatch, filters]);

    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
    };

    const handleNext = () => {
        if (pagination.currentPage < pagination.totalPages) {
            setFilters({ ...filters, page: pagination.currentPage + 1 });
        }
    };

    const handlePrev = () => {
        if (pagination.currentPage > 1) {
            setFilters({ ...filters, page: pagination.currentPage - 1 });
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading && <p>Đang tải tài liệu...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && documents.length === 0 && <p>Không có tài liệu để hiển thị.</p>}
            {!loading && documents.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
            <Pagination
                page={pagination.currentPage}
                totalPages={pagination.totalPages}
                onNext={handleNext}
                onPrev={handlePrev}
                onPageChange={handlePageChange}
                isLoading={loading}
            />
        </div>
    );
}
