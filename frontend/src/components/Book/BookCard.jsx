import { Star } from "lucide-react";

export default function BookCard({ book }) {
  return (
    <div
      className={`flex-none w-[140px] sm:w-[160px] md:w-[175px] bg-bg-surface rounded-lg p-3 border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
        book.isFeatured
          ? "border-blue-500 shadow-lg shadow-blue-500/10"
          : "border-border-main hover:border-border-focus hover:bg-slate-100"
      }`}
    >
      <div>
        {/* Book Cover */}
        <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-900 mb-3 shadow-md">
          <img
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {book.progress && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1">
              <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: book.progress }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Title & Author */}
        <h3 className="text-xs sm:text-sm font-semibold line-clamp-1 group-hover:text-blue-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-text-muted line-clamp-1 mt-0.5">
          {book.author}
        </p>
      </div>

      {/* Rating & Price */}
      <div className="mt-2 pt-2 border-t border-gray-800/60 flex flex-col gap-1">
        <div className="flex items-center space-x-1">
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
          </div>
          <span className="text-[11px] text-text-muted font-medium">{book.rating}</span>
        </div>
        <div className="text-xs font-bold text-text-muted">{book.price}</div>
      </div>
    </div>
  );
}
