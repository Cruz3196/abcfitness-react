import { useState } from 'react';
import { reviewStore } from '../../storeData/reviewStore';
import { userStore } from '../../storeData/userStore';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RatingCard = ({ review }) => {
  const { user: currentUser } = userStore();
  const { updateReview, deleteReview } = reviewStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.reviewText);
  const [editRating, setEditRating] = useState(review.rating);

  const isAuthor = currentUser && currentUser._id === review.user._id;

  const handleUpdate = () => {
    if (editRating === 0 || !editText) {
      toast.error('Please provide a rating and a review.');
      return;
    }
    updateReview(review._id, { reviewText: editText, rating: editRating });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
        deleteReview(review._id);
    }
  };

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                    <img src={review.user.profileImage || 'https://placehold.co/100x100?text=U'} alt={review.user.username} />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold">{review.user.username}</h4>
                    {!isEditing && (
                        <div className="rating rating-sm">
                            {[...Array(5)].map((_, i) => (
                                <input key={i} type="radio" name={`rating-${review._id}`} className="mask mask-star-2 bg-orange-400" disabled checked={i < review.rating} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isAuthor && !isEditing && (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-xs"><Edit size={16} /></button>
                    <button onClick={handleDelete} className="btn btn-ghost btn-xs text-error"><Trash2 size={16} /></button>
                </div>
            )}
        </div>

        {isEditing ? (
            <div className="mt-4 space-y-2">
                <div className="rating">
                    {[1, 2, 3, 4, 5].map(value => (
                        <input key={value} type="radio" name={`edit-rating-${review._id}`} className="mask mask-star-2 bg-orange-400" checked={editRating === value} onChange={() => setEditRating(value)} />
                    ))}
                </div>
                <textarea className="textarea textarea-bordered w-full" value={editText} onChange={(e) => setEditText(e.target.value)}></textarea>
                <div className="card-actions justify-end">
                    <button onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                    <button onClick={handleUpdate} className="btn btn-primary">Save</button>
                </div>
            </div>
        ) : (
            <p className="mt-4 text-base-content/80">{review.reviewText}</p>
        )}
      </div>
    </div>
  );
};

export default RatingCard;
