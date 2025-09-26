import React from 'react';
import { userStore } from '../../storeData/userStore';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, isHistory = false }) => {
    const { cancelBooking, isLoading } = userStore();

    const handleCancelBooking = async () => {
        // ✅ More descriptive confirmation message
        const confirmed = window.confirm(
            `Are you sure you want to cancel your booking for "${booking.class?.classTitle}"?\n\n` +
            `Session Date: ${new Date(booking.sessionDate).toLocaleDateString()}\n` +
            `This action cannot be undone.`
        );
        
        if (confirmed) {
            try {
                const success = await cancelBooking(booking._id);
                if (success) {
                    // ✅ The store will automatically refresh the bookings list via fetchMyBookings()
                    // No need for additional state management here since the parent component
                    // will re-render when the userStore state updates
                    console.log('Booking cancelled successfully');
                } else {
                    // Error handling is already done in the store
                    console.log('Failed to cancel booking');
                }
            } catch (error) {
                console.error('Unexpected error during cancellation:', error);
                toast.error('An unexpected error occurred');
            }
        }
    };

    // ✅ Helper function to format date and time
    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Date not available';
        
        const date = new Date(dateTime);
        const dateStr = date.toLocaleDateString(undefined, { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = date.toLocaleTimeString(undefined, { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `${dateStr} at ${timeStr}`;
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="card-title text-lg">
                            {booking.class?.classTitle || 'Class Title'}
                        </h3>
                        <p className="text-sm text-base-content/70 mb-2">
                            {formatDateTime(booking.sessionDate)}
                        </p>
                        
                        {/* Status Badge */}
                        <div className="mb-3">
                            <span className={`badge ${
                                booking.status === 'upcoming' ? 'badge-primary' :
                                booking.status === 'completed' ? 'badge-success' :
                                booking.status === 'cancelled' ? 'badge-error' : 
                                'badge-secondary'
                            }`}>
                                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                            </span>
                        </div>
                        
                        {/* Additional Details */}
                        <div className="text-sm text-base-content/70 space-y-1">
                            <p>
                                <span className="font-medium">Trainer:</span> {' '}
                                {booking.class?.trainer?.user?.username || 'Unknown Trainer'}
                            </p>
                            <p>
                                <span className="font-medium">Price:</span> {' '}
                                ${booking.class?.price || '0'}
                            </p>
                            {booking.class?.duration && (
                                <p>
                                    <span className="font-medium">Duration:</span> {' '}
                                    {booking.class.duration} minutes
                                </p>
                            )}
                        </div>
                    </div>
                    
                    {/* Class Image */}
                    {booking.class?.classPic && (
                        <div className="w-16 h-16 ml-4 flex-shrink-0">
                            <img 
                                src={booking.class.classPic} 
                                alt={booking.class.classTitle}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>
                
                {/* Action Buttons - Only show cancel for upcoming bookings */}
                {!isHistory && booking.status === 'upcoming' && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-error btn-sm"
                            onClick={handleCancelBooking}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Cancel Booking
                                </>
                            )}
                        </button>
                    </div>
                )}
                
                {/* Show rebooking option for cancelled bookings */}
                {booking.status === 'cancelled' && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                // Navigate to class detail page to rebook
                                window.location.href = `/classes/${booking.class?._id}`;
                            }}
                        >
                            Book Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;