export function RatingStars({ rating }) {
  const rounded = Math.round(rating ?? 0);

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < rounded ? "⭐" : "☆"}
        </span>
      ))}
      <span className="ml-1 text-xs text-slate-300">{rating.toFixed(1)}</span>
    </div>
  );
}

