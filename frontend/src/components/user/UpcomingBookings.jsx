import BookingCard from '../booking/BookingCard';

const UpcomingBookings = ({ bookings }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-primary pb-2">Upcoming Classes</h2>
                <div className="space-y-6">
                    {bookings.length > 0 ? (
                        bookings.map(booking => <BookingCard key={booking._id} booking={booking} />)
                    ) : (
                        <div className="card bg-base-100/10">
                            <div className="card-body">
                                <p className="text-gray-500">You have no upcoming classes booked. Time to hit the gym!</p>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default UpcomingBookings;
