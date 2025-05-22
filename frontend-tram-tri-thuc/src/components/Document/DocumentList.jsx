// frontend/src/components/Document/DocumentList.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocuments } from "../../store/slices/documentSlice";
import Pagination from "../Common/Pagination";
import DocumentCard from "./DocumentCard";

export default function DocumentList({ categorySlug = null, type = null }) {
    const dispatch = useDispatch();
    const { documents, featuredDocuments, loading, error, pagination, featuredPagination } =
        useSelector((state) => state.documents);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: "",
        category: categorySlug || "",
        sort: "createdAt:desc",
    });

    //
    useEffect(() => {
        if (type === "featured") {
            dispatch(
                fetchDocuments({ page: filters.page, limit: filters.limit, isFeatured: true })
            );
        } else {
            dispatch(fetchDocuments(filters));
        }
    }, [dispatch, filters, type]);

    //
    const handlePageChange = (page) => {
        setFilters({ ...filters, page });
    };

    //
    const handleNext = () => {
        const currentPagination = type === "featured" ? featuredPagination : pagination;
        if (currentPagination.currentPage < currentPagination.totalPages) {
            setFilters({ ...filters, page: currentPagination.currentPage + 1 });
        }
    };

    //
    const handlePrev = () => {
        if ((type === "featured" ? featuredPagination : pagination).currentPage > 1) {
            setFilters({
                ...filters,
                page: (type === "featured" ? featuredPagination : pagination).currentPage - 1,
            });
        }
    };

    //
    const displayDocuments = type === "featured" ? featuredDocuments : documents;
    const displayPagination = type === "featured" ? featuredPagination : pagination;

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading && <p>Đang tải tài liệu...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && displayDocuments.length === 0 && <p>Không có tài liệu để hiển thị.</p>}
                {!loading &&
                    displayDocuments.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
            </div>
            <Pagination
                page={displayPagination.currentPage}
                totalPages={displayPagination.totalPages}
                onNext={handleNext}
                onPrev={handlePrev}
                onPageChange={handlePageChange}
                isLoading={loading}
            />
        </div>
    );
}
