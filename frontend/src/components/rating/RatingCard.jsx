import { useState } from 'react';
import { Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingCard = ({ review, currentUser, onUpdate, onDelete, isSubmitting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review?.reviewText || '');
  const [editRating, setEditRating] = useState(review?.rating || 0);

  // ✅ Add safety checks for review and user data
  if (!review) {
    return null;
  }

  // ✅ Handle case where user data might not be populated
  const reviewUser = review.user || {};
  const isAuthor = currentUser && reviewUser._id && currentUser._id === reviewUser._id;

  const handleUpdate = async () => {
    if (editRating === 0 || !editText.trim()) {
      toast.error('Please provide a rating and a review.');
      return;
    }
    
    const result = await onUpdate(review._id, { 
      reviewText: editText.trim(), 
      rating: editRating 
    });
    
    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await onDelete(review._id);
    }
  };

  const handleEdit = () => {
    setEditText(review.reviewText || '');
    setEditRating(review.rating || 0);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditText(review.reviewText || '');
    setEditRating(review.rating || 0);
    setIsEditing(false);
  };

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full">
                {reviewUser.profileImage ? (
                  <img 
                    src={reviewUser.profileImage} 
                    alt={reviewUser.username || 'User'} 
                    className="object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full bg-base-300 flex items-center justify-center"
                  style={{ display: reviewUser.profileImage ? 'none' : 'flex' }}
                >
                  <User className="w-6 h-6 text-base-content/50" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold">
                {reviewUser.username || 'Anonymous User'}
              </h4>
              {!isEditing && (
                <div className="rating rating-sm">
                  {[...Array(5)].map((_, i) => (
                    <input 
                      key={i} 
                      type="radio" 
                      name={`rating-${review._id}-${i}`} 
                      className="mask mask-star-2 bg-orange-400" 
                      disabled 
                      checked={i < (review.rating || 0)}
                      readOnly
                    />
                  ))}
                </div>
              )}
              <p className="text-xs text-base-content/60">
                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                {review.updatedAt && review.updatedAt !== review.createdAt && (
                  <span className="ml-2">(edited)</span>
                )}
              </p>
            </div>
          </div>
          
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <button 
                onClick={handleEdit} 
                className="btn btn-ghost btn-xs"
                title="Edit review"
                disabled={isSubmitting}
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={handleDelete} 
                className="btn btn-ghost btn-xs text-error"
                title="Delete review"
                disabled={isSubmitting}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-4 space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Rating</span>
              </label>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Review</span>
              </label>
              <textarea 
                className="textarea textarea-bordered w-full" 
                value={editText} 
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Write your review..."
                rows={3}
              />
            </div>
            
            <div className="card-actions justify-end">
              <button 
                onClick={handleCancel} 
                className="btn btn-ghost"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                disabled={editRating === 0 || !editText.trim() || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-base-content/80">
              {review.reviewText || 'No review text provided.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingCard;