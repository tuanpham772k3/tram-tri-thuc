import React from "react";
import PropTypes from "prop-types";

const FilterControls = ({ filters, onFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            <select
                value={filters.mimeType || ""}
                onChange={(e) => onFilterChange("mimeType", e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Loại</option>
                <option value="application/pdf">PDF</option>
                <option value="application/msword">Word</option>
                <option value="application/vnd.ms-excel">Excel</option>
                <option value="image/jpeg">Hình ảnh</option>
            </select>
            <select
                value={filters.uploadDate || ""}
                onChange={(e) => onFilterChange("uploadDate", e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Ngày tải lên</option>
                {/* Tạo bộ lọc ngày tải lên */}

            </select>
            <select
                value={filters.uploadDate || ""}
                onChange={(e) => onFilterChange("uploadDate", e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Ngày sửa đổi</option>
                <option value="today">Hôm nay</option>
                <option value="lastWeek">7 ngày qua</option>
                <option value="lastMonth">30 ngày qua</option>
                <option value="earlier">Năm nay 2025</option>
                <option value="earlier">Năm nay 2024</option>

            </select>
            <select
                value={filters.userId || ""}
                onChange={(e) => onFilterChange("userId", e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Người</option>
                {/* sử dụng email để lọc người sở hữu */}
            </select>
        </div>
    );
};

FilterControls.propTypes = {
    filters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default FilterControls;
