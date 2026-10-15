import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { motion } from "framer-motion";
import { Star, MoveRight } from "lucide-react";
import BookGrid from "../../components/Book/BookGrid";
import { FaEye, FaStar } from "react-icons/fa";

const continueReadingBooks = [
  {
    id: "cr1",
    title: "Atomic Habits",
    author: "James Clear",
    rating: 4.9,
    price: "$15.99",
    cover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
    progress: "68%",
  },
  {
    id: "cr2",
    title: "Psychology of Money",
    author: "Morgan Housel",
    rating: 4.8,
    price: "$14.25",
    cover: "https://m.media-amazon.com/images/I/71X8k49QeRL._AC_UF1000,1000_QL80_.jpg",
    progress: "32%",
  },
  {
    id: "cr3",
    title: "Deep Work",
    author: "Cal Newport",
    rating: 4.7,
    price: "$16.50",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
    progress: "85%",
  },
  {
    id: "cr4",
    title: "Essentialism",
    author: "Greg McKeown",
    rating: 4.6,
    price: "$13.99",
    cover:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
    progress: "15%",
  },
  {
    id: "cr5",
    title: "Essentialism",
    author: "Greg McKeown",
    rating: 4.6,
    price: "$13.99",
    cover:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
    progress: "15%",
  },
];

const trendingBooks = [
  {
    id: "tb1",
    title: "Project Hail Mary",
    author: "Andy Weir",
    rating: 4.9,
    price: "$18.99",
    cover:
      "https://images.unsplash.com/photo-1618663938478-080f4381c814?auto=format&fit=crop&w=500&q=80",
    isFeatured: true,
  },
];

const bestSellerBooks = [
  {
    id: "bs1",
    title: "Sapiens: Brief History",
    author: "Yuval Noah Harari",
    rating: 4.9,
    price: "$19.99",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bs2",
    title: "The Almanack of Naval",
    author: "Eric Jorgenson",
    rating: 4.8,
    price: "$11.99",
    cover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bs3",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    rating: 4.7,
    price: "$14.99",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "bs4",
    title: "Zero to One",
    author: "Peter Thiel",
    rating: 4.6,
    price: "$13.50",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
  },
];

const newReleaseBooks = [
  {
    id: "nr1",
    title: "New Release Edition",
    author: "Alexander Hamilton",
    rating: 4.7,
    price: "$20.00",
    cover:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "nr2",
    title: "Build: An Unorthodox Guide",
    author: "Tony Fadell",
    rating: 4.9,
    price: "$18.50",
    cover:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "nr3",
    title: "Same as Ever",
    author: "Morgan Housel",
    rating: 4.8,
    price: "$16.99",
    cover:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "nr4",
    title: "Clear Thinking",
    author: "Shane Parrish",
    rating: 4.7,
    price: "$15.00",
    cover:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const contentVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const listItems = [
  {
    id: 1,
    title: "Làm chủ tuổi 20",
    subTitle: "Doctor X: Mafia in White",
    rating: 8,
    status: "Tập 2",
    buy: "73,084",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuZWawKUELp_6tBhlqIdDwVHP0v4W4bA9HLgAa8t7ExQ&s", // Thay bằng link ảnh thực tế của bạn
  },
  {
    id: 2,
    title: "Tư duy nhanh và chậm",
    subTitle: "Shadow Punisher (Season 1)",
    rating: 8.1,
    status: "Tập 19",
    buy: "156,234",
    image:
      "https://giadinh.phenikaa.com/wp-content/uploads/2025/09/tu-duy-nhanh-va-cham.jpg",
  },
  {
    id: 3,
    title: "Nhà giả kim",
    subTitle: "Against The Current",
    rating: 7.2,
    status: "Hoàn Tất (47/47)",
    buy: "1,078,464",
    image:
      "https://static-company.waka.vn/img.media/tin%20t%E1%BB%A9c/102023/nha%20gia%20kim.PNG",
  },
  {
    id: 4,
    title: "Kiến tạo thiên tài",
    subTitle: "Take Charge Of My Heart",
    rating: 7.8,
    status: "Hoàn Tất (10/10)",
    buy: "23,049",
    image:
      "https://vcdn1-giaitri.vnecdn.net/2025/03/22/nxbtre-full-12262024-112657-17-8353-6822-1742615121.jpg?w=1020&h=0&q=100&dpr=2&fit=crop&s=wSyArgkAt5afMiTP4kjhaA",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen">
      {/* Home Hero */}
      <div className="relative min-h-[500px] w-full overflow-hidden px-6 py-12 md:px-12">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/3 top-1/3 h-[250px] w-[250px] rounded-full bg-emerald-500/10 blur-[80px]" />

        <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12">
          {/* Book */}
          <motion.div
            className="flex justify-center md:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="group relative cursor-pointer"
              whileHover={{
                y: -8,
                rotateY: -5,
                rotateX: 5,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ perspective: 1000 }}
            >
              {/* Book glow */}
              <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-emerald-500/30 to-teal-500/30 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              {/* Book cover */}
              <div className="relative aspect-[2/3] w-[220px] overflow-hidden rounded-md border bg-slate-50 shadow-2xl shadow-black/80 sm:w-[260px] md:w-[280px]">
                <img
                  src="https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1660682804i/57668000.jpg"
                  alt="The Psychology of Money by Morgan Housel"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Shine */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex flex-col justify-center space-y-5 text-left md:col-span-7"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-extrabold uppercase leading-tight tracking-wider sm:text-3xl md:text-4xl"
            >
              THE PSYCHOLOGY OF MONEY
            </motion.h1>

            {/* Rating & author */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <span className="font-bold">4.8</span>
              <span>· Morgan Housel</span>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="line-clamp-4 max-w-xl text-sm leading-relaxed sm:text-base md:line-clamp-none"
            >
              Timeless lessons on wealth, greed, and happiness. Doing well with money
              isn’t necessarily about what you know. It’s about how you behave. And
              behavior is hard to teach, even to really smart people. Money—investing,
              personal finance, and business decisions—is typically taught as a math-based
              field.
            </motion.p>

            {/* Actions */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                {/* Buy */}
                <Button onClick={() => navigate("/explore")} type="primary" size="large">
                  <span>Explore now</span>
                  <MoveRight />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Home Overview */}
      <div className="flex gap-6 mt-8 mb-4">
        {/* Book Grid */}
        <div className="min-w-0 flex-1">
          <BookGrid
            title="Continuous Reading"
            books={continueReadingBooks}
            path="/libraries"
          />

          <BookGrid title="Trending Now" books={trendingBooks} path="/explore" />

          <BookGrid title="Best Sellers" books={bestSellerBooks} path="/explore" />
          <BookGrid title="New Releases" books={newReleaseBooks} path="/explore" />
        </div>

        {/* Book Recommendations */}
        <aside className="hidden md:block w-64 lg:w-75 shrink-0">
          {/* Hot Books */}
          <div className="p-4 rounded-md bg-slate-200">
            <div className=" flex items-center border-b-2 border-dashed border-slate-300 pb-1">
              <h2 className="text-violet-700 font-bold text-lg uppercase">
                Sách hot trong tuần
              </h2>
            </div>
            {/* List */}
            <div className="space-y-2 mt-4">
              {/* Item 1 */}
              <div className="p-3 flex items-center gap-4 rounded-md bg-slate-300">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                  1
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">Atomic Habits</h3>
                  <p className="truncate text-xs text-gray-700">James Clear</p>
                </div>
              </div>
              {/* Item 2 */}
              <div className="p-3 flex items-center gap-4 rounded-md bg-slate-300">
                <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                  2
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold">
                    The Subtle Art of Not Giving a F*ck
                  </h3>
                  <p className="truncate text-xs text-gray-700">Mark Manson</p>
                </div>
              </div>
            </div>
          </div>

          {/* High Rating Books */}
          <div className="bg-slate-200 mt-6 rounded-md p-4">
            {/* Title */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1.5 h-6 bg-violet-500 rounded-full"></div>
              <h2 className="font-bold text-lg uppercase tracking-wide">Đánh giá cao</h2>
            </div>
            {/* List */}
            <div className="flex flex-col space-y-4">
              {listItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 cursor-pointer group"
                >
                  {/* Ảnh bìa */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-22 object-cover rounded-md shrink-0"
                  />

                  {/* Thông tin chi tiết */}
                  <div className="flex flex-col justify-between flex-1 text-sm">
                    <div>
                      <h3 className="font-semibold group-hover:text-violet-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">
                        {item.subTitle}
                      </p>
                    </div>

                    {/* Đánh giá */}
                    <div className="flex items-center space-x-2 text-xs mt-2">
                      <span className="flex items-center text-yellow-400 font-medium">
                        <FaStar className="mr-1 text-xs" /> {item.rating}
                      </span>
                    </div>

                    {/* Lượt mua */}
                    <div className="flex items-center text-xs mt-1">
                      <span>{item.buy} lượt mua</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
