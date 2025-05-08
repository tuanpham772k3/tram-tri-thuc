import React from "react";
import PropTypes from "prop-types";
import { FaList, FaTh } from "react-icons/fa";
import FilterControls from "../../ui/FilterControls";

const PageHeader = ({ title, view, onViewChange, filters, onFilterChange }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h1>
            <div className="flex items-center space-x-2">
                {filters && <FilterControls filters={filters} onFilterChange={onFilterChange} />}
                <div className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full flex">
                    <button
                        onClick={() => onViewChange("list")}
                        className={`p-2 rounded-full ${view === "list" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"}`}
                    >
                        <FaList size={16} />
                    </button>
                    <button
                        onClick={() => onViewChange("grid")}
                        className={`p-2 rounded-full ${view === "grid" ? "bg-blue-500 text-white" : "text-gray-600 dark:text-gray-300"}`}
                    >
                        <FaTh size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    view: PropTypes.oneOf(["list", "grid"]).isRequired,
    onViewChange: PropTypes.func.isRequired,
    filters: PropTypes.object,
    onFilterChange: PropTypes.func,
};

export default PageHeader;
