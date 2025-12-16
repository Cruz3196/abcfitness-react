import { useState } from "react";
import { Star, Edit, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";

const ProductReviewCard = ({
  review,
  currentUser,
  onUpdate,
  onDelete,
  isSubmitting,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review?.text || "");
  const [editRating, setEditRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!review) return null;

  const reviewUser = review.user || {};
  const isAuthor =
    currentUser && reviewUser._id && currentUser._id === reviewUser._id;

  const handleUpdate = async () => {
    if (editRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!editText.trim()) {
      toast.error("Please write a review");
      return;
    }

    const result = await onUpdate(review._id, {
      text: editText.trim(),
      rating: editRating,
    });

    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await onDelete(review._id);
    }
  };

  const handleCancel = () => {
    setEditText(review.text || "");
    setEditRating(review.rating || 0);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render stars
  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`${
              interactive ? "btn btn-ghost btn-xs p-0 hover:bg-transparent" : ""
            }`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setEditRating(star)}
          >
            <Star
              className={`w-4 h-4 ${
                star <= (interactive ? hoverRating || editRating : rating)
                  ? "fill-warning text-warning"
                  : "text-base-content/30"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body p-5">
        <div className="flex items-start justify-between gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center overflow-hidden">
                {reviewUser.profileImage ? (
                  <img
                    src={reviewUser.profileImage}
                    alt={reviewUser.username || "User"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-base-content/50" />
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                {reviewUser.username || "Anonymous"}
              </h4>
              <p className="text-xs text-base-content/60">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Edit/Delete buttons for author */}
          {isAuthor && !isEditing && (
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-ghost btn-xs"
                title="Edit review"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-ghost btn-xs text-error"
                title="Delete review"
                disabled={isSubmitting}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Review Content */}
        {isEditing ? (
          <div className="mt-3 space-y-3">
            {/* Edit Rating */}
            <div>
              <label className="label py-1">
                <span className="label-text text-sm">Rating</span>
              </label>
              {renderStars(editRating, true)}
            </div>

            {/* Edit Text */}
            <textarea
              className="textarea textarea-bordered w-full h-24 resize-none text-sm"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={500}
            />

            {/* Edit Actions */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="btn btn-ghost btn-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-primary btn-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            {/* Display Rating */}
            <div className="mb-2">{renderStars(review.rating)}</div>
            {/* Display Review Text */}
            <p className="text-sm text-base-content/80 leading-relaxed">
              {review.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviewCard;
