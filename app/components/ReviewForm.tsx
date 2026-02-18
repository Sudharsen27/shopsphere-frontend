"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

type ReviewFormProps = {
  productId: string;
  onReviewSubmitted?: () => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!userInfo) {
    return (
      <div className="mt-8 border border-gray-700 p-6 rounded-lg bg-gray-900">
        <p className="text-gray-400 mb-4">
          Please{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            login
          </button>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    if (comment.trim().length > 1000) {
      setError("Comment cannot exceed 1000 characters");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review");
      }

      // Reset form
      setRating(0);
      setComment("");
      setError(null);

      // Notify parent component to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      } else {
        // Reload page to show new review
        window.location.reload();
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 sm:mt-8 border border-gray-700 p-4 sm:p-6 rounded-lg bg-gray-900">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className={`text-3xl transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-600"
                } hover:text-yellow-400 cursor-pointer`}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className="text-gray-400 ml-2">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Share your thoughts about this product..."
          />
          <p className="text-xs text-gray-400 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0 || !comment.trim()}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white font-medium transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
