import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
    return (
        <div className="mb-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Tìm tài liệu..."
                    className="w-full outline-none text-sm"
                    onChange={(e) => onSearch?.(e.target.value)}
                />
            </div>
        </div>
    );
}
