import React from "react";
import { motion } from "framer-motion";

// Dữ liệu danh mục chính (Main Category Cards)
const categoriesData = [
  {
    id: "programming",
    title: "Programming",
    description:
      "High quality software engineering and web development books for all skill levels.",
    btnText: "Explore Programming",
    bgImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    books: [
      {
        title: "Clean Code",
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Psychology of Money",
        cover:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Dune",
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
      },
    ],
    className: "col-span-12 lg:col-span-8",
  },
  {
    id: "science-fiction",
    title: "Science Fiction",
    tag: "NEW RELEASES",
    description:
      "High-quality stories and immersive futuristic adventures that stretch the imagination and explore sci-fi technology.",
    btnText: "Explore Sci-Fi",
    bgImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
    books: [
      {
        title: "Clean Code",
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Atomic Habits",
        cover:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "The Odyssey",
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
      },
    ],
    className: "col-span-12 lg:col-span-8",
  },
  {
    id: "business",
    title: "Business",
    description:
      "High-quality artwork and effective business guides and leadership insights for modern entrepreneurs and strategic thinkers.",
    btnText: "Explore Business",
    bgImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    className: "col-span-12 lg:col-span-4 row-span-2",
  },
  {
    id: "fantasy",
    title: "Fantasy",
    description:
      "Immerse yourself in high fantasy epic adventures and magical worlds full of wonder and ancient mysteries.",
    btnText: "Explore Fantasy",
    bgImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop",
    books: [
      {
        title: "Clean Code",
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "The Odyssey",
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Dune",
        cover:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop",
      },
    ],
    className: "col-span-12 md:col-span-6 lg:col-span-6",
  },
  {
    id: "non-fiction",
    title: "Non-Fiction",
    description:
      "High-quality creative insights and comprehensive analysis of the real world, philosophy, and history.",
    btnText: "Explore Non-Fiction",
    bgImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop",
    books: [
      {
        title: "Clean Code",
        cover:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Deep Work",
        cover:
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop",
      },
      {
        title: "Psychology of Money",
        cover:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300&auto=format&fit=crop",
      },
    ],
    className: "col-span-12 md:col-span-6 lg:col-span-6",
  },
];

// Dữ liệu Trending Genres (Top phải)
const trendingGenres = [
  {
    title: "Programming",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Science Fiction",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Business",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Fantasy",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=200&auto=format&fit=crop",
  },
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-[#0d0f17] text-white p-4 sm:p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hàng 1: Programming Card & Trending Genres */}
        <div className="grid grid-cols-12 gap-6">
          {/* Card Programming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-800 p-6 md:p-8 flex flex-col justify-between group min-h-[260px]"
          >
            {/* Background Image overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${categoriesData[0].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f121d] via-[#0f121d]/80 to-transparent" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center h-full">
              {/* Ảnh bìa sách bên trái */}
              <div className="sm:col-span-5 flex items-center space-x-2 sm:-space-x-4">
                {categoriesData[0].books?.map((book, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg overflow-hidden shadow-2xl border border-gray-700 relative z-10 first:z-30 last:z-20 transform -rotate-3 hover:rotate-0 transition-all"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Thông tin mô tả bên phải */}
              <div className="sm:col-span-7 flex flex-col justify-center items-start space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                  {categoriesData[0].title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  {categoriesData[0].description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-colors text-sm"
                >
                  {categoriesData[0].btnText}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Section Trending Genres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="col-span-12 lg:col-span-4 flex flex-col justify-between"
          >
            <h3 className="text-xl font-bold text-white mb-4">Trending Genres</h3>
            <div className="grid grid-cols-4 gap-3">
              {trendingGenres.map((genre, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden border border-gray-800 group-hover:border-blue-500 transition-colors shadow-md">
                    <img
                      src={genre.image}
                      alt={genre.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs text-gray-300 font-medium mt-2 text-center line-clamp-1">
                    {genre.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hàng 2: Science Fiction & Business Card */}
        <div className="grid grid-cols-12 gap-6">
          {/* Card Science Fiction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-800 p-6 md:p-8 flex flex-col justify-between group min-h-[300px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${categoriesData[1].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f121d] via-[#0f121d]/80 to-transparent" />

            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
              {categoriesData[1].tag && (
                <span className="self-start text-[10px] font-semibold tracking-widest text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-md border border-gray-700 uppercase">
                  {categoriesData[1].tag}
                </span>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-7 space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                    {categoriesData[1].title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    {categoriesData[1].description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-colors text-sm"
                  >
                    {categoriesData[1].btnText}
                  </motion.button>
                </div>

                <div className="sm:col-span-5 flex items-center justify-end space-x-2">
                  {categoriesData[1].books?.map((book, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -6, scale: 1.05 }}
                      className="w-18 h-28 sm:w-20 sm:h-32 rounded-lg overflow-hidden shadow-2xl border border-gray-700 transform hover:rotate-0 transition-all"
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card Business (Card Dọc Cao) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-12 lg:col-span-4 relative overflow-hidden rounded-2xl bg-gradient-to-b from-gray-900 to-slate-900 border border-gray-800 p-6 md:p-8 flex flex-col justify-end group min-h-[300px] lg:min-h-full"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-35 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${categoriesData[2].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f121d] via-[#0f121d]/70 to-transparent" />

            <div className="relative z-10 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {categoriesData[2].title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {categoriesData[2].description}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg transition-colors text-sm"
              >
                {categoriesData[2].btnText}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Hàng 3: Fantasy & Non-Fiction Cards */}
        <div className="grid grid-cols-12 gap-6">
          {/* Card Fantasy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-12 md:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-800 p-6 md:p-8 flex flex-col justify-between group min-h-[260px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${categoriesData[3].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f121d] via-[#0f121d]/85 to-transparent" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center h-full">
              <div className="sm:col-span-6 space-y-3">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {categoriesData[3].title}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {categoriesData[3].description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg transition-colors text-xs sm:text-sm"
                >
                  {categoriesData[3].btnText}
                </motion.button>
              </div>

              <div className="sm:col-span-6 flex items-center justify-end space-x-2">
                {categoriesData[3].books?.map((book, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="w-16 h-24 sm:w-18 sm:h-28 rounded-lg overflow-hidden shadow-xl border border-gray-700"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card Non-Fiction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-12 md:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-slate-900 border border-gray-800 p-6 md:p-8 flex flex-col justify-between group min-h-[260px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 group-hover:scale-105 transition-transform duration-700 ease-out"
              style={{ backgroundImage: `url(${categoriesData[4].bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f121d] via-[#0f121d]/85 to-transparent" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center h-full">
              <div className="sm:col-span-6 space-y-3">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {categoriesData[4].title}
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {categoriesData[4].description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl shadow-lg transition-colors text-xs sm:text-sm"
                >
                  {categoriesData[4].btnText}
                </motion.button>
              </div>

              <div className="sm:col-span-6 flex items-center justify-end space-x-2">
                {categoriesData[4].books?.map((book, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="w-16 h-24 sm:w-18 sm:h-28 rounded-lg overflow-hidden shadow-xl border border-gray-700"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
