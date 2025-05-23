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
        <div >
            <h4 className="font-medium text-sm text-gray-700 mb-2">🎛 Bộ lọc</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full sm:w-1/2 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <select
                    value={filters.sort}
                    onChange={(e) => handleChange("sort", e.target.value)}
                    className="w-full sm:w-1/3 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                    <option value="createdAt:desc">Mới nhất</option>
                    <option value="createdAt:asc">Cũ nhất</option>
                    <option value="views:desc">Xem nhiều</option>
                    <option value="downloads:desc">Tải nhiều</option>
                </select>
            </div>
        </div>
    );
}
