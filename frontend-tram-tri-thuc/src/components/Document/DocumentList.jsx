import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import { loadDocuments } from "../../store/slices/documentSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DocumentList({ categorySlug = null, type = null }) {
    const dispatch = useDispatch();
    const { list: allDocuments, loading } = useSelector((state) => state.document);

    useEffect(() => {
        dispatch(loadDocuments());
    }, [dispatch]);

    const filterDocuments = () => {
        let filtered = allDocuments;

        if (categorySlug) {
            filtered = filtered.filter((doc) => doc.category === categorySlug);
        }

        if (type === "featured") {
            filtered = filtered.filter((doc) => doc.isFeatured); // ví dụ: có cờ đánh dấu nổi bật
        }

        return filtered;
    };

    const documents = filterDocuments();

    if (loading) return <p>Đang tải tài liệu...</p>;

    if (documents.length === 0) return <p>Không có tài liệu để hiển thị.</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
                <DocumentCard key={doc._id} document={doc} />
            ))}
        </div>
    );
}
