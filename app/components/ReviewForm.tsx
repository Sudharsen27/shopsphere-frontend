"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const { userInfo } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      router.push("/login");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    if (comment.length > 1000) {
      setError("Comment cannot exceed 1000 characters");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

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

      if (res.ok) {
        setSuccess(true);
        setRating(0);
        setComment("");
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Submit review error:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="mt-6 sm:mt-8 border border-gray-700 p-4 sm:p-6 rounded-lg bg-gray-900 text-center">
        <p className="text-sm sm:text-base text-gray-400 mb-3">
          Please{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            login
          </button>{" "}
          to write a review
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 border border-gray-700 p-4 sm:p-6 rounded-lg bg-gray-900">
      <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
          Review submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                {(hoveredRating >= star || (!hoveredRating && rating >= star)) ? (
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 hover:text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-2 text-gray-300">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            rows={4}
            maxLength={1000}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base resize-none"
          />
          <div className="text-xs sm:text-sm text-gray-400 mt-1 text-right">
            {comment.length}/1000 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0 || !comment.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-sm sm:text-base"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
