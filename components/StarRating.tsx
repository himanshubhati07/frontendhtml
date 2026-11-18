import { StarIcon } from "@/components/Icons";

export function StarRating({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${className} ${star <= Math.round(rating) ? "text-secondary" : "text-line"}`}
          filled
        />
      ))}
    </span>
  );
}
