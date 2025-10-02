import React, { useState } from 'react';
import { userStore } from '../../storeData/userStore';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, isHistory = false }) => {
    const { cancelBooking, isLoading } = userStore();
    const [isCancelling, setIsCancelling] = useState(false);

    console.log('📋 BookingCard received:', {
        bookingId: booking?._id,
        classTitle: booking?.class?.classTitle,
        status: booking?.status,
        isHistory
    });


    if (!booking) return null;

    const handleCancelBooking = async () => {
        if (isCancelling) return;
        
        const bookingTitle = booking.class?.classTitle || 'this class';
        
        const confirmed = window.confirm(`Are you sure you want to cancel your booking for "${bookingTitle}"?`);
        
        if (confirmed) {
            try {
                setIsCancelling(true);
                await cancelBooking(booking._id);
                toast.success('Booking cancelled successfully');
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error('Failed to cancel booking');
            } finally {
                setIsCancelling(false);
            }
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Date not available';
        try {
            return new Date(dateTime).toLocaleString();
        } catch {
            return 'Invalid date';
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <h3 className="card-title text-lg">
                    {booking.class?.classTitle || 'Unknown Class'}
                </h3>
                
                <p className="text-sm text-base-content/70 mb-2">
                    {formatDateTime(booking.sessionDate || booking.startTime)}
                </p>
                
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
                
                <div className="text-sm text-base-content/70 space-y-1">
                    <p>
                        <span className="font-medium">Trainer:</span> {' '}
                        {booking.class?.trainer?.user?.username || 'Unknown Trainer'}
                    </p>
                    <p>
                        <span className="font-medium">Price:</span> {' '}
                        <span className="text-primary font-semibold">
                            ${booking.class?.price || 0}
                        </span>
                    </p>
                </div>
                
                {!isHistory && booking.status === 'upcoming' && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-error btn-sm"
                            onClick={handleCancelBooking}
                            disabled={isLoading || isCancelling}
                        >
                            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                    </div>
                )}
                
                {booking.status === 'cancelled' && booking.class?._id && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => window.location.href = `/classes/${booking.class._id}`}
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