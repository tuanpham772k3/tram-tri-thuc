import { useState, useEffect } from "react";
import showToast from "../../utils/toast";

export default function FilterPanel({
    filtersConfig = [],
    sortOptions = [],
    onFilterChange,
    filters, // Nhận filters từ CategoryPage
    defaultFilters = {},
    hideDateField = false,
}) {
    const [localFilters, setLocalFilters] = useState(filters || defaultFilters);
    const [dateError, setDateError] = useState(null);

    // Đồng bộ localFilters với filters từ props
    useEffect(() => {
        setLocalFilters(filters || defaultFilters);
    }, [filters, defaultFilters]);

    const handleChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);

        // Validate date range
        if (key === "startDate" || key === "endDate") {
            const start = new Date(newFilters.startDate);
            const end = new Date(newFilters.endDate);
            if (
                newFilters.startDate &&
                newFilters.endDate &&
                !isNaN(start.getTime()) &&
                !isNaN(end.getTime())
            ) {
                if (start > end) {
                    setDateError("Ngày bắt đầu phải trước ngày kết thúc");
                    return;
                } else {
                    setDateError(null);
                }
            }
        }
    };

    const handleApplyFilters = () => {
        if (dateError) return;
        onFilterChange({ ...localFilters, page: 1 }); // Reset page về 1 khi áp dụng bộ lọc
        showToast("success", "Đã áp dụng bộ lọc");
    };

    const handleResetFilters = () => {
        const resetFilters = {
            search: "",
            sort: sortOptions[0]?.value || "createdAt:desc",
            ...filtersConfig.reduce((acc, filter) => {
                acc[filter.key] = filter.type === "multi-select" ? [] : filter.defaultValue || "";
                return acc;
            }, {}),
            endDate: "",
            ...(hideDateField ? {} : { dateField: "createdAt" }),
        };
        setLocalFilters(resetFilters);
        onFilterChange({ ...resetFilters, page: 1 }); // Reset page về 1 khi xóa bộ lọc
        showToast("success", "Đã đặt lại bộ lọc");
    };

    return (
        <div className="p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <h4 className="font-medium text-sm text-gray-700 mb-2">🎛 Bộ lọc</h4>
            <div className="flex flex-col gap-3">
                {/* Dynamic Filters */}
                {filtersConfig.map((filter) => (
                    <div key={filter.key} className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">{filter.label}</label>
                        {filter.type === "select" && (
                            <select
                                value={localFilters[filter.key] || ""}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            >
                                <option value="">{filter.placeholder || "Tất cả"}</option>
                                {filter.options?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {filter.type === "multi-select" && (
                            <div className="relative">
                                <select
                                    multiple
                                    value={localFilters[filter.key] || []}
                                    onChange={(e) =>
                                        handleChange(
                                            filter.key,
                                            Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value
                                            )
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 h-24"
                                >
                                    {filter.options?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Giữ Ctrl (Windows) hoặc Cmd (Mac) để chọn nhiều danh mục
                                </p>
                            </div>
                        )}
                        {filter.type === "date" && (
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    placeholder={filter.placeholder || ""}
                                    value={localFilters[filter.key] || ""}
                                    onChange={(e) => handleChange(filter.key, e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                                {filter.key === "startDate" && (
                                    <input
                                        type="date"
                                        placeholder="Ngày kết thúc"
                                        value={localFilters.endDate || ""}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Date Field Selector */}
                {!hideDateField && (localFilters.startDate || localFilters.endDate) && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Lọc theo trường ngày</label>
                        <select
                            value={localFilters.dateField || "createdAt"}
                            onChange={(e) => handleChange("dateField", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            <option value="createdAt">Ngày tạo</option>
                            <option value="updatedAt">Ngày cập nhật</option>
                        </select>
                    </div>
                )}

                {/* Date Error */}
                {dateError && <p className="text-red-500 text-xs">{dateError}</p>}

                {/* Sort Options */}
                {sortOptions.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Sắp xếp</label>
                        <select
                            value={localFilters.sort}
                            onChange={(e) => handleChange("sort", e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={handleApplyFilters}
                        disabled={dateError}
                        className={`px-4 py-1 rounded text-sm transition ${
                            dateError
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Áp dụng bộ lọc
                    </button>
                    <button
                        onClick={handleResetFilters}
                        className="bg-gray-500 text-white px-4 py-1 rounded text-sm hover:bg-gray-600 transition"
                    >
                        Xóa bộ lọc
                    </button>
                </div>
            </div>
        </div>
    );
}
