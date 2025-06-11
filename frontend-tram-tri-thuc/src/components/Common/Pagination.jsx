import PropTypes from "prop-types";

const Pagination = ({ page, totalPages, onNext, onPrev, onPageChange, isLoading }) => {
    // Generate page numbers with smart truncation
    const generatePageNumbers = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }

        if (page - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (page + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pageNumbers = totalPages <= 1 ? [] : generatePageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Page Info */}
            <div className="flex items-center text-sm text-gray-600">
                <svg
                    className="w-4 h-4 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
                <span className="font-medium">Trang {page}</span>
                <span className="mx-1">của</span>
                <span className="font-medium">{totalPages}</span>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                    onClick={onPrev}
                    disabled={page === 1 || isLoading}
                    className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                            page === 1 || isLoading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                        }
                    `}
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1 mx-2">
                    {pageNumbers.map((num, index) => {
                        if (num === "...") {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    className="px-2 py-2 text-gray-400 text-sm"
                                >
                                    ...
                                </span>
                            );
                        }

                        const isCurrentPage = num === page;
                        return (
                            <button
                                key={num}
                                onClick={() => onPageChange(num)}
                                disabled={isLoading || isCurrentPage}
                                className={`
                                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px]
                                    ${
                                        isCurrentPage
                                            ? "bg-blue-600 text-white shadow-md"
                                            : isLoading
                                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                                    }
                                `}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    onClick={onNext}
                    disabled={page === totalPages || isLoading}
                    className={`
                        flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                            page === totalPages || isLoading
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                        }
                    `}
                >
                    Sau
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            {/* Quick Jump (Optional - can be enabled) */}
            {totalPages > 10 && (
                <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">Đi tới:</span>
                    <input
                        type="number"
                        min="1"
                        max={totalPages}
                        className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                const value = parseInt(e.target.value);
                                if (value >= 1 && value <= totalPages && value !== page) {
                                    onPageChange(value);
                                    e.target.value = "";
                                }
                            }
                        }}
                        disabled={isLoading}
                    />
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex items-center text-sm text-blue-600">
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Đang tải...
                </div>
            )}
        </div>
    );
};

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

Pagination.defaultProps = {
    isLoading: false,
};

export default Pagination;
