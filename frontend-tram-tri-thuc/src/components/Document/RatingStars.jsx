export default function RatingStars({ rating }) {
    const fullStars = Math.floor(rating);
    const stars = Array.from({ length: 5 }, (_, i) => (i < fullStars ? "⭐" : "☆"));

    return <div className="text-yellow-500 text-lg">{stars.join("")}</div>;
}
