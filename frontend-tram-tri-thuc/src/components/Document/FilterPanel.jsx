export default function FilterPanel({ onFilterChange }) {
    return (
        <div className="p-3 border rounded mb-4">
            <h4 className="font-semibold mb-2">🎛 Bộ lọc nâng cao</h4>
            <div className="space-y-2">
                <select
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => onFilterChange("type", e.target.value)}
                >
                    <option value="">Loại tài liệu</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">Word</option>
                </select>
                <select
                    className="w-full border rounded px-2 py-1"
                    onChange={(e) => onFilterChange("year", e.target.value)}
                >
                    <option value="">Thời gian</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </div>
        </div>
    );
}
