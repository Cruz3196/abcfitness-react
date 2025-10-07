import React, { useState } from 'react';
import { userStore } from '../../storeData/userStore';

const BookingCard = ({ booking, onBookingUpdate }) => {
    const { cancelBooking } = userStore();
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        
        setIsCancelling(true);
        try {
            const result = await cancelBooking(booking._id);
            if (result.success) {
            }
        } finally {
            setIsCancelling(false);
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {booking.class?.classTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                        with {booking.class?.trainer?.user?.username}
                    </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Active
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span> {formatDateTime(booking.sessionDate)}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Duration:</span> {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                </p>
                <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment:</span> 
                    <span className="capitalize ml-1">{booking.paymentStatus}</span>
                </p>
            </div>

            <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="w-30 btn btn-error px-4 py-2 rounded-md transition-colors"
            >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
            </button>
        </div>
    );
};

export default BookingCard;