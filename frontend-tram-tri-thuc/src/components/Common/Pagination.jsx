import PropTypes from "prop-types";

const Pagination = ({ page, totalPages, onNext, onPrev, onPageChange, isLoading }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
            <button
                onClick={onPrev}
                disabled={page === 1 || isLoading}
                className={`px-4 py-2 rounded ${
                    page === 1 || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                Trang trước
            </button>
            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded ${
                        num === page
                            ? "bg-blue-600 text-white"
                            : isLoading
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                    {num}
                </button>
            ))}
            <button
                onClick={onNext}
                disabled={page === totalPages || isLoading}
                className={`px-4 py-2 rounded ${
                    page === totalPages || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {isLoading ? "Đang tải..." : "Trang sau"}
            </button>
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
