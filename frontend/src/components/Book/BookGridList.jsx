import BookCard from "./BookCard";

export default function BookGridList({ books, showAddToCart = false }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} showAddToCart={showAddToCart} />
      ))}
    </div>
  );
}
