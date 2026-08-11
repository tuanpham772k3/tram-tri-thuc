// frontend/src/components/Pagination.js

const Pagination = ({ page, totalPages, onNext, onPrev, onPageChange, isLoading }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
        Math.max(0, page - 3),
        Math.min(totalPages, page + 2)
    );

    return (
        <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <button
                onClick={onPrev}
                disabled={page === 1 || isLoading}
                className={`px-4 py-2 rounded text-sm ${
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
                    disabled={isLoading || num === page}
                    className={`px-3 py-1 rounded text-sm ${
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
                className={`px-4 py-2 rounded text-sm ${
                    page === totalPages || isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                Trang sau
            </button>
        </div>
    );
};

export default Pagination;
