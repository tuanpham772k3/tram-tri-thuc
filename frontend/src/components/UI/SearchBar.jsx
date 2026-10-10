import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex items-center gap-2 border border-gray-300 rounded-2xl px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search books..."
        className="hidden md:block px-3 py-1 text-sm focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
