import { useRef } from "react";
import BookCarouselList from "./BookCarouselList";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function BookCarousel({ title, books, actionLabel }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm sm:text-base font-bold text-text-main uppercase tracking-wider font-sans">
          {title}
        </h2>

        <button className="text-xs sm:text-sm text-text-muted hover:text-white flex items-center gap-1 transition-colors group">
          <span>{actionLabel || "See all"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="relative">
        {/* Scroll Navigation Arrows */}
        <div className="hidden lg:flex items-center justify-between absolute -top-2 -bottom-2 -left-6 -right-6 pointer-events-none z-20">
          <button className="pointer-events-auto p-2 rounded-full bg-bg-main border border-border-main hover:text-white hover:bg-bg-muted shadow-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="pointer-events-auto p-2 rounded-full bg-bg-main border border-border-main hover:text-white hover:bg-bg-muted shadow-xl transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div ref={containerRef} className="overflow-x-auto scrollbar-none scroll-smooth">
          <BookCarouselList books={books} />
        </div>
      </div>
    </div>
  );
}
