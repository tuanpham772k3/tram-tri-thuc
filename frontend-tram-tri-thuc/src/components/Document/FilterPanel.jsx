// frontend/src/components/Document/FilterPanel.js
import { useState } from "react";

export default function FilterPanel({ onFilterChange }) {
    const [filters, setFilters] = useState({
        search: "",
        sort: "createdAt:desc",
    });

    const handleChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="p-3 border rounded mb-4">
            <h4 className="font-semibold mb-2">🎛 Bộ lọc nâng cao</h4>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm tài liệu..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                <select
                    value={filters.sort}
                    onChange={(e) => handleChange("sort", e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="createdAt:desc">Mới nhất</option>
                    <option value="createdAt:asc">Cũ nhất</option>
                    <option value="views:desc">Xem nhiều nhất</option>
                    <option value="downloads:desc">Tải nhiều nhất</option>
                </select>
            </div>
        </div>
    );
}
