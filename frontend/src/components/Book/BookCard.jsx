import { ShoppingBag, ShoppingCart, Star, Trash } from "lucide-react";
import { Button } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";

export default function BookCard({ book, showAddToCart = false, showRemove = false }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-xl p-3 max-w-50 cursor-pointer">
      {/* Book Cover */}
      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-300 relative">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {book.progress && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1">
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div
                className="bg-violet-500 h-full rounded-full"
                style={{ width: book.progress }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-2 space-y-1.5">
        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">{book.title}</h3>

        {/* Author */}
        <p className="text-[11px] sm:text-xs line-clamp-1 mt-0.5">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
          </div>
          <span className="text-[11px] font-medium">{book.rating}</span>
        </div>

        {/* Price */}
        <div className="text-xs font-bold">{book.price}</div>
      </div>

      {/* Add to Cart Button */}
      {showAddToCart && (
        <div className="mt-3 flex items-center gap-2">
          <Button className="flex-1 !bg-violet-500 !text-white !border-none hover:!bg-violet-700 transition-colors">
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </Button>
          <Button className="!p-2 hover:!border-red-500 hover:!text-red-500">
            <FaRegTrashAlt size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
