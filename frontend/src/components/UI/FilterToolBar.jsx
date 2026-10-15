import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

const FilterToolBar = ({ filters }) => {
  const [activeFilters, setActiveFilters] = useState(["Bộ lọc"]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleFilter = (label) => {
    setActiveFilters((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleClick = (filter) => {
    if (filter.type === "dropdown") {
      setOpenDropdown((prev) => (prev === filter.label ? null : filter.label));
      return;
    }

    if (filter.type === "toggle") {
      toggleFilter(filter.label);
      return;
    }

    if (filter.label === "Bộ lọc") {
      setOpenDropdown((prev) => (prev === "Bộ lọc" ? null : "Bộ lọc"));
    }

    if (filter.label === "Xem theo giá") {
      setOpenDropdown((prev) => (prev === "Xem theo giá" ? null : "Xem theo giá"));
    }
  };

  return (
    <section className="w-full">
      <h2 className="mb-5 text-xl font-bold">Chọn theo tiêu chí</h2>

      {/* Filter buttons */}
      <div className="flex flex-wrap items-center gap-1.5">
        {filters.map((filter, index) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.label);
          const isOpen = openDropdown === filter.label;

          return (
            <button
              key={`${filter.label}-${index}`}
              type="button"
              onClick={() => handleClick(filter)}
              className={`inline-flex h-[42px] shrink-0 items-center justify-center gap-2 cursor-pointer
              rounded-xl border px-4 text-sm transition-colors
                ${
                  isActive
                    ? "border-violet-500 bg-violet-100 text-violet-600"
                    : "border-transparent bg-gray-200 hover:border-gray-300 hover:bg-gray-300"
                }
                ${
                  filter.type === "dropdown" && isOpen
                    ? "border-gray-300 bg-gray-200"
                    : ""
                }`}
            >
              {Icon && <Icon size={19} strokeWidth={1.8} />}

              <span className="whitespace-nowrap">{filter.label}</span>

              {filter.type === "dropdown" && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected filters */}
      {activeFilters.length > 1 && (
        <div className="mt-7">
          <h2 className="mb-5 text-xl font-bold">Đang lọc theo</h2>

          <div className="flex flex-wrap items-center gap-3">
            {activeFilters
              .filter((filter) => filter !== "Bộ lọc")
              .map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className="inline-flex h-[42px] items-center gap-2 rounded-xl
                border border-gray-500 px-3 text-sm transition-colors
                hover:bg-gray-100 cursor-pointer"
                >
                  {filter}

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200">
                    <X size={14} strokeWidth={2.5} />
                  </span>
                </button>
              ))}

            <button
              type="button"
              onClick={() => setActiveFilters([])}
              className="px-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Bỏ chọn tất cả
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterToolBar;
