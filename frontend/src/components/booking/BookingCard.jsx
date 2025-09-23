import {  bookingStore } from '../../storeData/bookingStore';
import { XCircle } from 'lucide-react';

const BookingCard = ({ booking, isHistory = false }) => {
    const { cancelBooking, isLoading } = bookingStore();
    const { class: classDetails, startTime, status } = booking;

    // Format the date for display
    const formattedDate = new Date(startTime).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="card card-side bg-base-100 shadow-xl">
            <figure className="w-1/3">
                <img 
                    src={classDetails.classPic || 'https://placehold.co/200x200?text=Class'} 
                    alt={classDetails.classTitle} 
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{classDetails.classTitle}</h2>
                <p>{formattedDate}</p>
                <div className="card-actions justify-end items-center">
                    {/* If it's a history item, show its status. Otherwise, show a cancel button. */}
                    {isHistory ? (
                        <div className={`badge ${status === 'cancelled' ? 'badge-error' : 'badge-ghost'} capitalize`}>
                            {status}
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                    cancelBooking(booking._id);
                                }
                            }}
                            className="btn btn-error btn-sm"
                            disabled={isLoading}
                        >
                            <XCircle size={16} />
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingCard;

