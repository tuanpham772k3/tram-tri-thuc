import { Button } from "antd";
import { motion } from "framer-motion";
import { Star, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function HomeHero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[500px] w-full overflow-hidden px-6 py-12 md:px-12">
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
            Timeless lessons on wealth, greed, and happiness. Doing well with money isn’t
            necessarily about what you know. It’s about how you behave. And behavior is
            hard to teach, even to really smart people. Money—investing, personal finance,
            and business decisions—is typically taught as a math-based field.
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
    </section>
  );
}
