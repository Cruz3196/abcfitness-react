import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const ProductReviewForm = ({ productId, onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    const result = await onSubmit({
      text: reviewText.trim(),
      rating,
    });

    if (result?.success) {
      setRating(0);
      setReviewText("");
    }
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-xl">Write a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Your Rating</span>
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="btn btn-ghost btn-sm p-1 hover:bg-transparent"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-warning text-warning"
                        : "text-base-content/30"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-base-content/70 self-center">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Your Review</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-28 resize-none"
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={500}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/50">
                {reviewText.length}/500 characters
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="card-actions justify-end">
            <button
              type="submit"
              className="btn btn-primary gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewForm;
