import { useState, useEffect } from "react";
import SearchBar from "../components/Document/SearchBar";
import DocumentCard from "../components/Document/DocumentCard";
import FilterPanel from "../components/Document/FilterPanel";

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({ category: "", uploader: "", format: "" });
    const [mockDocuments, setMockDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate fetching data from an API
        const fetchDocuments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await new Promise((resolve) =>
                    setTimeout(() => resolve([
                        {
                            id: 1,
                            title: "Báo cáo AI",
                            uploader: "Nguyễn Văn A",
                            mimeType: "application/pdf",
                            category: "Công nghệ",
                        },
                        {
                            id: 2,
                            title: "Kinh tế vĩ mô",
                            uploader: "Trần Thị B",
                            mimeType: "application/vnd.ms-powerpoint",
                            category: "Kinh tế",
                        },
                    ]), 1000)
                );
                setMockDocuments(response);
            } catch (err) {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

     // Hàm để cập nhật bộ lọc
    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    const filteredDocs = mockDocuments.filter(
        (doc) =>
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filters.category === "" || doc.category === filters.category) &&
            (filters.uploader === "" || doc.uploader.includes(filters.uploader)) &&
            (filters.format === "" || doc.mimeType.includes(filters.format))
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Tìm kiếm tài liệu</h1>
            <SearchBar onSearch={setSearchQuery} />
            <FilterPanel onFilterChange={handleFilterChange} />
            <div className="mt-6">
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : filteredDocs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredDocs.map((doc) => (
                            <DocumentCard key={doc.id} document={doc} />
                        ))}
                    </div>
                ) : (
                    <p>Không tìm thấy tài liệu phù hợp.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
