import { useMemo, useState } from "react";
import BookGrid from "../../components/Book/BookGrid";
import { ChevronDown, ChevronRight, Search, Filter, X } from "lucide-react";

const myBooks = [
  {
    id: "bs1",
    title: "Sapiens: Brief History",
    author: "Yuval Noah Harari",
    rating: 4.9,
    price: "$19.99",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
    progress: 0,
  },
  {
    id: "bs2",
    title: "The Almanack of Naval",
    author: "Eric Jorgenson",
    rating: 4.8,
    price: "$11.99",
    cover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80",
    progress: 45,
  },
  {
    id: "bs3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    rating: 4.7,
    price: "$14.99",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
    progress: 100,
  },
  {
    id: "bs4",
    title: "Zero to One",
    author: "Peter Thiel",
    rating: 4.6,
    price: "$13.50",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
    progress: 68,
  },
];

const authors = ["Morgan Housel", "Atomic Habits", "Marika Tavelt"];

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(200);
  const [rating, setRating] = useState(5);
  const [authorSearch, setAuthorSearch] = useState("");

  // Trạng thái mở/đóng Sidebar trên Mobile
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Quản lý trạng thái đóng/mở của từng section
  const [openSections, setOpenSections] = useState({
    categories: true,
    author: true,
    datePublished: false,
    genre: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const readingBooks = useMemo(
    () => myBooks.filter((book) => book.progress > 0 && book.progress < 100),
    []
  );

  const completedBooks = useMemo(
    () => myBooks.filter((book) => book.progress === 100),
    []
  );

  const currentBooks = {
    all: myBooks,
    reading: readingBooks,
    completed: completedBooks,
  }[activeTab];

  // Nội dung Sidebar Filters dùng chung cho cả Desktop và Mobile
  const FilterContent = () => (
    <form className="flex flex-col gap-4 text-sm">
      {/* Categories */}
      <div className="border border-border-main p-4 rounded-2xl">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between font-semibold text-text-main mb-3 cursor-pointer"
        >
          <span>Categories</span>
          {openSections.categories ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
        {openSections.categories && (
          <div className="flex items-center gap-2 text-text-muted pl-1">
            <input
              type="checkbox"
              id="on-store"
              className="rounded border-border accent-primary cursor-pointer"
            />
            <label htmlFor="on-store" className="cursor-pointer text-xs">
              On Store
            </label>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="border border-border-main p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-text-main">Price</h3>
          <span className="text-xs text-text-muted">${price}</span>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full accent-primary cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
        />
      </div>

      {/* Rating */}
      <div className="border border-border-main p-4 rounded-2xl">
        <h3 className="font-semibold text-text-main mb-2">Rating</h3>
        <div className="flex items-center gap-1 cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <svg
                className={`w-5 h-5 ${
                  star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="border border-border-main p-4 rounded-2xl">
        <button
          type="button"
          onClick={() => toggleSection("author")}
          className="w-full flex items-center justify-between font-semibold text-text-main mb-3 cursor-pointer"
        >
          <span>Author</span>
          {openSections.author ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {openSections.author && (
          <>
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-text-muted">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Search"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-border rounded-md text-text-main focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2 pl-1">
              {authors
                .filter((author) =>
                  author.toLowerCase().includes(authorSearch.toLowerCase())
                )
                .map((author, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-text-muted text-xs cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-border accent-primary cursor-pointer"
                    />
                    <span>{author}</span>
                  </label>
                ))}
            </div>
          </>
        )}
      </div>

      {/* Date Published */}
      <div className="border border-border-main p-4 rounded-2xl">
        <div
          onClick={() => toggleSection("datePublished")}
          className="flex items-center justify-between font-semibold text-text-main cursor-pointer"
        >
          <span>Date Published</span>
          {openSections.datePublished ? (
            <ChevronDown size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </div>
      </div>

      {/* Genre */}
      <div className="border border-border-main p-4 rounded-2xl">
        <div
          onClick={() => toggleSection("genre")}
          className="flex items-center justify-between font-semibold text-text-main cursor-pointer"
        >
          <span>Genre</span>
          {openSections.genre ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3">
        <button className="border border-border-main p-3 rounded-xl font-semibold bg-violet-700 text-white cursor-pointer hover:bg-violet-800 transition-colors">
          Refine Search
        </button>
        <button className="border border-border-main p-3 rounded-xl font-semibold text-text-disabled">
          Reset filter
        </button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-8 text-center">
        <h1 className="text-base sm:text-lg font-bold text-text-main uppercase tracking-wider">
          Explore
        </h1>
        <p className="mt-2 text-sm text-text-muted">Discover new books</p>
      </div>

      <section className="w-full px-4 md:px-12 py-8">
        <div className="flex flex-col gap-6">
          {/* Search & Sort & Filter Button Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
            {/* Input Tìm kiếm */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search ..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Sort & Filter Toggle Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {/* Nút lọc hiển thị riêng trên Mobile/Tablet */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg bg-background text-text-main hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} />
                <span>Filters</span>
              </button>

              {/* Select Sắp xếp */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort"
                  className="text-sm text-text-muted whitespace-nowrap hidden sm:inline"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="px-3 py-2 text-sm bg-background border border-border rounded-lg text-text-main focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="title-asc">Title (A - Z)</option>
                  <option value="title-desc">Title (Z - A)</option>
                  <option value="rating-desc">Highest Rated</option>
                  <option value="progress-desc">Progress</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-8 items-start">
            {/* Sidebar cho Desktop (Màn hình md trở lên) */}
            <aside className="hidden md:block w-64 shrink-0">
              <h1 className="font-bold text-lg text-text-main mb-4">Filter Option</h1>
              <FilterContent />
            </aside>

            {/* Sidebar Drawer cho Mobile (Màn hình dưới md) */}
            {isMobileFilterOpen && (
              <div className="fixed inset-0 z-50 md:hidden flex">
                {/* Overlay làm mờ nền */}
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                  onClick={() => setIsMobileFilterOpen(false)}
                />

                {/* Drawer Container */}
                <div className="relative ml-auto w-full max-w-xs bg-background h-full shadow-xl flex flex-col z-10 overflow-y-auto p-6">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
                    <h2 className="font-bold text-lg text-text-main">Filters</h2>
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1 rounded-md text-text-muted hover:text-text-main"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <FilterContent />
                </div>
              </div>
            )}

            {/* Book Grid */}
            <div className="min-w-0 flex-1">
              <BookGrid title="Books" books={myBooks} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
