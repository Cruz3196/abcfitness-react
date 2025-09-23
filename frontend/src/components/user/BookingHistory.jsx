import BookingCard from '../booking/BookingCard';

const BookingHistory = ({ bookings }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-700 pb-2">Booking History</h2>
                <div className="space-y-6">
                {bookings.length > 0 ? (
                    bookings.map(booking => <BookingCard key={booking._id} booking={booking} isHistory={true} />)
                ) : (
                    <div className="card bg-base-100/10">
                        <div className="card-body">
                            <p className="text-gray-500">You have no past bookings.</p>
                        </div>
                    </div>
                )}
                </div>
        </div>
    );
};

export default BookingHistory;
