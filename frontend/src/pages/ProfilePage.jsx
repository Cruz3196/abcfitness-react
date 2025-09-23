import { useEffect } from 'react';
import { userStore } from '../storeData/userStore';
import { bookingStore } from '../storeData/bookingStore';
import Spinner from '../components/common/Spinner';
import UpcomingBookings from '../components/user/UpcomingBookings';
import BookingHistory from '../components/user/BookingHistory';

const ProfilePage = () => {
    const { user } = userStore();
    const { upcomingBookings, bookingHistory, isLoading, fetchMyBookings } = bookingStore();

    useEffect(() => {
        // Fetch the user's bookings when the component mounts
        fetchMyBookings();
    }, [fetchMyBookings]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold">Welcome, {user?.username}</h1>
                <p className="text-lg text-gray-400 mt-2">Here's a look at your fitness schedule.</p>
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <UpcomingBookings bookings={upcomingBookings} />
                <BookingHistory bookings={bookingHistory} />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

