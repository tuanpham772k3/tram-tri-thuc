import { ArrowRight } from "lucide-react";
import BookGridList from "./BookGridList";

export default function BookGrid({ title, books, actionLabel, showAddToCart = false }) {
  return (
    <div className="relative group/carousel">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider">
          {title}
        </h2>

        <button className="text-xs sm:text-sm flex items-center gap-1 transition-colors group">
          <span>{actionLabel || "See all"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <BookGridList books={books} showAddToCart={showAddToCart} />
      </div>
    </div>
  );
}
