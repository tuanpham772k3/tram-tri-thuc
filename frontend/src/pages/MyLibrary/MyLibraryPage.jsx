import { useMemo, useState } from "react";
import BookGrid from "../../components/Book/BookGrid";

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

const MyLibraryPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const readingBooks = useMemo(
    () => myBooks.filter((book) => book.progress > 0 && book.progress < 100),
    []
  );

  const completedBooks = useMemo(
    () => myBooks.filter((book) => book.progress === 100),
    []
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleViewAllReading = () => {
    setActiveTab("reading");
  };

  const currentBooks = {
    all: myBooks,
    reading: readingBooks,
    completed: completedBooks,
  }[activeTab];

  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="pt-8 text-center">
        <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider">
          My Library
        </h1>

        <p className="mt-2 text-sm">Your personal collection</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex items-center gap-6 border-b">
            <button
              type="button"
              onClick={() => handleTabChange("all")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "all" ? "text-primary border-b-2 border-primary" : ""
              }`}
            >
              All Books
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("reading")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "reading" ? "text-primary border-b-2 border-primary" : ""
              }`}
            >
              Reading
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("completed")}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === "completed" ? "text-primary border-b-2 border-primary" : ""
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Search & Sort Bar (Nằm trên một thanh ngang ngay dưới tab) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          {/* Input Tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search title or author..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-lg placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Select Sắp xếp */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label htmlFor="sort" className="text-sm whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              className="px-3 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="title-asc">Title (A - Z)</option>
              <option value="title-desc">Title (Z - A)</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="progress-desc">Progress</option>
            </select>
          </div>
        </div>

        {/* All Books */}
        {activeTab === "all" && (
          <div className="flex flex-col gap-10">
            {/* My Books */}
            <BookGrid title="My Books" books={myBooks} />
          </div>
        )}

        {/* Reading */}
        {activeTab === "reading" && <BookGrid title="Reading" books={readingBooks} />}

        {/* Completed */}
        {activeTab === "completed" && (
          <BookGrid title="Completed" books={completedBooks} />
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
