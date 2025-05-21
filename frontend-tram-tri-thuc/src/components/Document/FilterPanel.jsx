// frontend/src/components/Document/FilterPanel.js
import { useState } from "react";

export default function FilterPanel({ onFilterChange }) {
    const [filters, setFilters] = useState({
        format: "",
        createdAt: "",
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
                <select
                    className="w-full border rounded px-2 py-1"
                    value={filters.format}
                    onChange={(e) => handleChange("format", e.target.value)}
                >
                    <option value="">Loại tài liệu</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">Word</option>
                </select>
                <select
                    className="w-full border rounded px-2 py-1"
                    value={filters.createdAt}
                    onChange={(e) => handleChange("createdAt", e.target.value)}
                >
                    <option value="">Thời gian</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                </select>
            </div>
        </div>
    );
}
