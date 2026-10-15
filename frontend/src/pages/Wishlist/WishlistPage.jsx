import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search } from "lucide-react";
import BookGrid from "../../components/Book/BookGrid";
import SortBar from "../../components/UI/SortBar";

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

const sorts = [
  { label: "Thêm gần đây", value: "recently_save" },
  { label: "Giá cao - thấp", value: "progress_desc", icon: ArrowDownWideNarrow },
  { label: "Giá thấp - cao", value: "progress_asc", icon: ArrowUpWideNarrow },
];

const WishlistPage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="pt-8 text-center">
        <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider">
          Sách yêu thích
        </h1>

        <p className="mt-2 text-sm">Bộ sưu tập cá nhân của bạn</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Search */}
        <div className="relative w-full sm:w-80 ">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Search title or author..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-lg placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Sort Bar */}
        <SortBar sorts={sorts} />

        <div>
          <span className="text-gray-400">12 cuốn sách đã lưu</span>
          <BookGrid books={myBooks} showAddToCart={true} showRemove={true} />
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
