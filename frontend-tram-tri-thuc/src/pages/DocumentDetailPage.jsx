import { useParams } from "react-router-dom";
import DownloadButton from "../components/Document/DownloadButton";
import CommentSection from "../components/Document/CommentSection";
import RatingStars from "../components/Document/RatingStars";

export default function DocumentDetailPage() {
    const { id } = useParams();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">📝 Tiêu đề tài liệu</h1>
            <p className="text-gray-600 mb-2">Tác giả: Nguyễn Văn A • 2024</p>
            <RatingStars rating={4.5} />
            <DownloadButton documentId={id} />
            <hr className="my-4" />
            <CommentSection documentId={id} />
        </div>
    );
}
