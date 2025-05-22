// frontend/src/pages/DocumentDetailPage.js
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DownloadButton from "../components/Document/DownloadButton";
import CommentSection from "../components/Document/CommentSection";
import RatingStars from "../components/Document/RatingStars";
import { fetchDocumentBySlug } from "../store/slices/documentSlice";

export default function DocumentDetailPage() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentDocument, loading, error } = useSelector((state) => state.documents);

    useEffect(() => {
        dispatch(fetchDocumentBySlug(slug));
    }, [dispatch, slug]);

    if (loading) return <p className="p-6">Đang tải...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!currentDocument) return <p className="p-6">Tài liệu không tồn tại.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">📝 {currentDocument.title}</h1>
            <p className="text-gray-600 mb-2">
                Tác giả: {currentDocument.uploaderId?.name || "Unknown"} •{" "}
                {new Date(currentDocument.createdAt).toLocaleDateString()}
            </p>
            <RatingStars rating={currentDocument.rating || 0} />
            <DownloadButton documentId={slug} />
            <hr className="my-4" />
            <CommentSection documentId={slug} />
        </div>
    );
}
