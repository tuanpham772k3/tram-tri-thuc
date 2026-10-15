import BookGrid from "../../components/Book/BookGrid";
import {
  Search,
  SlidersHorizontal,
  Truck,
  ShoppingCart,
  CircleDollarSign,
  Star,
  LibraryBig,
  UserRoundPen,
  ShoppingBasket,
  TrendingUp,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";
import SortBar from "../../components/UI/SortBar";
import FilterToolBar from "../../components/UI/FilterToolBar";

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

const filters = [
  { label: "Bộ lọc", value: "filter", icon: SlidersHorizontal, type: "action" },
  { label: "Xem theo giá", value: "price", icon: CircleDollarSign, type: "action" },
  { label: "Đánh giá", value: "rating", icon: Star, type: "action" },
  { label: "Số lượt mua", value: "best_seller", icon: ShoppingBasket, type: "action" },
  { label: "Danh mục", value: "categories", icon: LibraryBig, type: "dropdown" },
  { label: "Tác giả", value: "author", icon: UserRoundPen, type: "dropdown" },
];

const sorts = [
  { label: "Phổ biến", value: "popular", icon: TrendingUp },
  { label: "Mới nhất", value: "newest" },
  { label: "Đánh giá cao nhất", value: "rating_desc", icon: Star },
  { label: "Giá thấp - cao", value: "price_asc", icon: ArrowUpWideNarrow },
  { label: "Giá cao - thấp", value: "price_desc", icon: ArrowDownWideNarrow },
];

const ExplorePage = () => {
  return (
    <div className="w-full min-h-screen">
      {/* Header */}
      <div className="pt-8 text-center">
        <h1 className="text-base sm:text-lg font-bold uppercase tracking-wider">
          Khám phá sách
        </h1>
        <p className="mt-2 text-sm">Khám phá những cuốn sách mới</p>
      </div>

      <div className="mt-6">
        {/* Filter */}
        <FilterToolBar filters={filters} />

        {/* Sort */}
        <SortBar sorts={sorts} />

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Tìm kiếm</h2>
          {/* Input Tìm kiếm */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm tên sách..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border rounded-lg placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Book Grid */}
        <div className="mt-6">
          <BookGrid books={myBooks} />
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
