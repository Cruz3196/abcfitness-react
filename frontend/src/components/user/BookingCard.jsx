const BookingCard = ({ booking, isHistory = false }) => {
    const handleCancelBooking = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            // For now, just show an alert - we'll add the store functionality later
            alert('Cancel booking functionality will be implemented soon!');
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-4">
            <div className="card-body">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="card-title text-lg">{booking.class?.classTitle || 'Class Title'}</h3>
                        <p className="text-sm text-gray-600">
                            {new Date(booking.startTime).toLocaleDateString()} at {new Date(booking.startTime).toLocaleTimeString()}
                        </p>
                        <div className="mt-2">
                            <span className={`badge ${
                                booking.status === 'upcoming' ? 'badge-primary' :
                                booking.status === 'completed' ? 'badge-success' :
                                booking.status === 'cancelled' ? 'badge-error' : 'badge-secondary'
                            }`}>
                                {booking.status}
                            </span>
                        </div>
                    </div>
                    
                    {booking.class?.classPic && (
                        <div className="w-16 h-16 ml-4">
                            <img 
                                src={booking.class.classPic} 
                                alt={booking.class.classTitle}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>
                
                {!isHistory && booking.status === 'upcoming' && (
                    <div className="card-actions justify-end mt-4">
                        <button 
                            className="btn btn-error btn-sm"
                            onClick={handleCancelBooking}
                        >
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingCard;