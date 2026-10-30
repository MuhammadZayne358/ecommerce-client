// src/components/reviews/ProductReviews.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProductReviews, createReview, deleteReview } from "../../api/reviewApi";
import type { Review } from "../../types/review";


function Stars({
  rating,
  onClick,
}: {
  rating: number;
  onClick?: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={onClick ? 26 : 16}
          onClick={() => onClick?.(value)}
          className={`${
            value <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          } ${onClick ? "cursor-pointer" : ""}`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: number }) {

  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const loadReviews = async () => {
    const response = await getProductReviews(productId);

    setReviews(response.reviews);
    setAverage(response.average);
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    try {
      await createReview(productId, {rating, comment})

      setRating(0);
      setComment("");
      loadReviews();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add review.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this review?")) return;

    await deleteReview(productId, id);
    loadReviews();
  };

  return (
    <div className="mt-16">
      <div className="border-b border-violet-100">
        <span className="inline-block border-b-2 border-violet-600 pb-3 text-lg font-medium text-violet-700">
          Reviews ({reviews.length})
        </span>
      </div>

      {reviews.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          <span className="font-sans text-4xl font-bold text-gray-900 lining-nums">
            {average.toFixed(1)}
          </span>
          <Stars rating={Math.round(average)} />
        </div>
      )}

      {/* Review form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm"
        >
          <h3 className="font-serif text-xl font-semibold text-gray-900">
            Write a Review
          </h3>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-4">
            <Stars rating={rating} onClick={setRating} />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share what you think about this fragrance"
            className="mt-4 w-full resize-none rounded-xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-sm outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
          />

          <button
            type="submit"
            className="mt-4 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-gray-600">
          <Link to="/login" className="font-semibold text-violet-700 underline">
            Login
          </Link>{" "}
          to write a review.
        </p>
      )}

      {/* Reviews list */}
      <div className="mt-6 space-y-4">
        {reviews.length === 0 && (
          <p className="rounded-2xl bg-violet-50 p-8 text-center text-gray-500">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{review.userName}</p>
              <Stars rating={review.rating} />
            </div>

            {review.comment && (
              <p className="mt-3 text-sm text-gray-600">{review.comment}</p>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>

              {(user?.userId === review.userId || user?.role === "Admin") && (
                <button
                  onClick={() => handleDelete(review.id)}
                  className="font-medium text-rose-600 hover:text-rose-800"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;