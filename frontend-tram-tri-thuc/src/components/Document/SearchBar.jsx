export default function SearchBar({ onSearch }) {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="🔍 Tìm tài liệu..."
                className="w-full border px-3 py-2 rounded shadow-sm"
                onChange={(e) => onSearch?.(e.target.value)}
            />
        </div>
    );
}
