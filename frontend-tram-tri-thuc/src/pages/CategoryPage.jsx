import { useParams } from "react-router-dom";
import DocumentList from "../components/Document/DocumentList";

// Bản đồ ánh xạ slug sang tên hiển thị đẹp
const categoryMap = {
    "cong-nghe": "Công nghệ",
    "kinh-te": "Kinh tế",
    "khoa-hoc": "Khoa học",
    luat: "Luật",
    "y-te": "Y tế",
};

export default function CategoryPage() {
    const { slug } = useParams();
    const displayName = categoryMap[slug] || slug.replace(/-/g, " ");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">📁 Danh mục: {displayName}</h1>
            <DocumentList categorySlug={slug} />
        </div>
    );
}
