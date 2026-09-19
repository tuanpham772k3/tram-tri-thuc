import BookCarousel from "../Book/BookCarousel";

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

export default function HomeOverview() {
  return (
    <section className="w-full px-4 md:px-12 py-8 min-h-screen">
      <div className="flex flex-col gap-6">
        <BookCarousel
          title="Continuous Reading"
          books={continueReadingBooks}
          actionLabel="See all"
        />

        <BookCarousel title="Trending Now" books={trendingBooks} actionLabel="See all" />

        <BookCarousel
          title="Best Sellers"
          books={bestSellerBooks}
          actionLabel="See all"
        />
        <BookCarousel
          title="New Releases"
          books={newReleaseBooks}
          actionLabel="See all"
        />
      </div>
    </section>
  );
}
