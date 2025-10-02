import { useState } from 'react';
import toast from 'react-hot-toast';

const RatingForm = ({ classId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !reviewText) {
      toast.error('Please provide a rating and a review.');
      return;
    }
    setIsLoading(true);
    toast.loading('Submitting...');
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    onSubmit({ rating, reviewText }); // Pass the new review data up to the parent page
    
    toast.dismiss();
    toast.success('Thank you for your feedback!');
    setRating(0);
    setReviewText('');
    setIsLoading(false);
  };

  return (
    <div className="card bg-base-200 shadow-md mt-8">
      <div className="card-body">
        <h3 className="card-title">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Your Rating</span></label>
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text">Your Review</span></label>
            <textarea 
              className="textarea textarea-bordered h-24" 
              placeholder="Tell us about your experience..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="card-actions justify-end">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;
