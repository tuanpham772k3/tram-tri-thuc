import React, { useState } from "react";

const SortBar = ({ sorts }) => {
  const [activeSorts, setActiveSorts] = useState("Tiêu đề (A-Z)");

  const handleClick = (sort) => {
    setActiveSorts(sort.label);
  };

  return (
    <div className="mt-6 flex items-center justify-between">
      <h2 className="text-xl font-bold">Sắp xếp theo</h2>

      <div className="flex gap-4">
        {sorts.map((sort, index) => {
          const Icon = sort.icon;
          const isActive = activeSorts.includes(sort.label);
          return (
            <button
              key={`${sort.label}-${index}`}
              type="button"
              onClick={() => handleClick(sort)}
              className={`inline-flex h-[42px] shrink-0 items-center justify-center gap-2 rounded-full
            cursor-pointer border px-4 text-sm transition-colors
                ${
                  isActive
                    ? "border-violet-300 bg-violet-100 text-violet-600"
                    : "border-transparent bg-gray-200 hover:border-gray-300 hover:bg-gray-300"
                }
                `}
            >
              {Icon && <Icon size={19} strokeWidth={1.8} />}

              <span className="whitespace-nowrap">{sort.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SortBar;
