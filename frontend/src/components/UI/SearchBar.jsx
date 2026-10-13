import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="flex items-center gap-1 rounded-xl px-3 py-1 bg-white text-sm focus:outline-none">
      <Search className="w-5 h-5" />
      <input
        type="text"
        placeholder="Bạn muốn mua gì hôm nay..."
        className="hidden md:block px-3 py-1 text-base focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
