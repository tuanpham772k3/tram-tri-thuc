import BookGridList from "./BookGridList";
import { Link } from "react-router-dom";

export default function BookGrid({
  title,
  books,
  path,
  showAddToCart = false,
  showRemove = false,
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <Link to={path}>
          <h2 className="text-xl font-bold border-b-2 border-violet-700 uppercase">
            {title}
          </h2>
        </Link>
      </div>

      <BookGridList books={books} showAddToCart={showAddToCart} showRemove={showRemove} />
    </div>
  );
}
