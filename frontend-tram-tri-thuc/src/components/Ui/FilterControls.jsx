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
                <option value="">Ngày sửa đổi</option>
                <option value="today">Hôm nay</option>
                <option value="lastWeek">Tuần trước</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="earlier">Đầu năm nay</option>
            </select>
            <select
                value={filters.userId || ""}
                onChange={(e) => onFilterChange("userId", e.target.value)}
                className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">Người sở hữu</option>
                <option value="tôi">Tôi</option>
            </select>
        </div>
    );
};

FilterControls.propTypes = {
    filters: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
};

export default FilterControls;
