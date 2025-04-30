import React from "react";
import PropTypes from "prop-types";

const StorageProgressBar = ({ used, total }) => {
    const percentage = (used / total) * 100;

    return (
        <div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
                {used} GB / {total} GB đã dùng
            </p>
        </div>
    );
};

StorageProgressBar.propTypes = {
    used: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
};

export default StorageProgressBar;
