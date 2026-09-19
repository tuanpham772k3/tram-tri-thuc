import BookCard from "./BookCard";

export default function BookCarouselList({ books }) {
  return (
    <div className="flex items-stretch gap-4 overflow-x-auto scrollbar-none py-1">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
