import React, { useState } from 'react';
import { userStore } from '../../storeData/userStore';
import { classStore } from '../../storeData/classStore';
import toast from 'react-hot-toast';

const BookingCard = ({ booking, isHistory = false, onBookingUpdate }) => {
    const { cancelBooking, isLoading } = userStore();
    const { bookClass } = classStore();
    const [isCancelling, setIsCancelling] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const handleCancelBooking = async () => {
        if (isCancelling) return;
        
        const bookingTitle = booking.class?.classTitle || 'this class';
        
        const confirmed = window.confirm(`Are you sure you want to cancel your booking for "${bookingTitle}"?`);
        
        if (confirmed) {
            try {
                setIsCancelling(true);
                await cancelBooking(booking._id);
                toast.success('Booking cancelled successfully! You can now book this session again.');
                
                // ✅ Trigger callback to parent component if provided
                if (onBookingUpdate) {
                    onBookingUpdate();
                }
                
            } catch (error) {
                console.error('Error cancelling booking:', error);
                toast.error('Failed to cancel booking');
            } finally {
                setIsCancelling(false);
            }
        }
    };

    const handleRebookClass = async () => {
        if (isBooking || !booking.class?._id) return;
        
        const bookingTitle = booking.class?.classTitle || 'this class';
        
        try {
            setIsBooking(true);
            const result = await bookClass(booking.class._id);
            
            if (result.success) {
                toast.success(`Successfully rebooked "${bookingTitle}"!`);
                
                // ✅ Trigger callback to parent component to refresh bookings
                if (onBookingUpdate) {
                    onBookingUpdate();
                }
            }
        } catch (error) {
            console.error('Error rebooking class:', error);
            toast.error(error.message || 'Failed to rebook class');
        } finally {
            setIsBooking(false);
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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'upcoming':
                return 'badge-primary';
            case 'completed':
                return 'badge-success';
            case 'cancelled':
                return 'badge-error';
            default:
                return 'badge-secondary';
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="card-title text-lg">
                        {booking.class?.classTitle || 'Unknown Class'}
                    </h3>
                    <div className={`badge ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Unknown'}
                    </div>
                </div>
                
                <p className="text-sm text-base-content/70 mb-3">
                    📅 {formatDateTime(booking.sessionDate || booking.startTime)}
                </p>
                
                <div className="text-sm text-base-content/70 space-y-2">
                    <p className="flex items-center gap-2">
                        <span className="font-medium">👨‍💼 Trainer:</span>
                        {booking.class?.trainer?.user?.username || 'Unknown Trainer'}
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="font-medium">💰 Price:</span>
                        <span className="text-primary font-semibold">
                            ${booking.class?.price || 0}
                        </span>
                    </p>
                    {booking.class?.description && (
                        <p className="flex items-start gap-2">
                            <span className="font-medium">📝 Description:</span>
                            <span className="text-xs text-base-content/60 line-clamp-2">
                                {booking.class.description}
                            </span>
                        </p>
                    )}
                </div>
                
                {/* Action Buttons */}
                <div className="card-actions justify-end mt-4">
                    {/* Cancel button for upcoming bookings */}
                    {!isHistory && booking.status === 'upcoming' && (
                        <button 
                            className="btn btn-error btn-sm"
                            onClick={handleCancelBooking}
                            disabled={isLoading || isCancelling}
                        >
                            {isCancelling ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Cancelling...
                                </>
                            ) : (
                                'Cancel Booking'
                            )}
                        </button>
                    )}
                    
                    {/* Rebook button for cancelled classes */}
                    {booking.status === 'cancelled' && booking.class?._id && (
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={handleRebookClass}
                            disabled={isBooking}
                        >
                            {isBooking ? (
                                <>
                                    <span className="loading loading-spinner loading-xs"></span>
                                    Booking...
                                </>
                            ) : (
                                '🔄 Book Again'
                            )}
                        </button>
                    )}
                    
                    {/* View class details button */}
                    {booking.class?._id && (
                        <button 
                            className="btn btn-outline btn-sm"
                            onClick={() => window.location.href = `/classes/${booking.class._id}`}
                        >
                            📝 View Details
                        </button>
                    )}
                </div>
                
                {/* Show cancellation date if cancelled */}
                {booking.status === 'cancelled' && booking.cancelledAt && (
                    <div className="mt-3 p-2 bg-error/10 rounded-lg">
                        <p className="text-xs text-error">
                            ❌ Cancelled on: {formatDateTime(booking.cancelledAt)}
                        </p>
                    </div>
                )}
                
                {/* Show completion date if completed */}
                {booking.status === 'completed' && booking.completedAt && (
                    <div className="mt-3 p-2 bg-success/10 rounded-lg">
                        <p className="text-xs text-success">
                            ✅ Completed on: {formatDateTime(booking.completedAt)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;