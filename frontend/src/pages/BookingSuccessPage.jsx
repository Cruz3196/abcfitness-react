import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const BookingSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyBooking = async () => {
            if (!sessionId) {
                setError("No booking session ID found.");
                setIsLoading(false);
                return;
            }
            try {
                // This corresponds to your POST /api/payments/bookingSuccess endpoint
                await api.post('/payments/bookingSuccess', { session_id: sessionId });
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while confirming your booking.");
            } finally {
                setIsLoading(false);
            }
        };
        verifyBooking();
    }, [sessionId]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    {isLoading ? (
                        <Spinner />
                    ) : error ? (
                        <>
                            <AlertTriangle className="w-24 h-24 text-error mx-auto mb-4" />
                            <h1 className="text-5xl font-bold text-error">Booking Failed</h1>
                            <p className="py-6">{error}</p>
                            <Link to="/classes" className="btn btn-error">Return to Classes</Link>
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-24 h-24 text-success mx-auto mb-4" />
                            <h1 className="text-5xl font-bold">Booking Confirmed!</h1>
                            <p className="py-6">Your spot is secured. We've sent a confirmation email with all the details.</p>
                                <div className="space-x-4 mt-6">
                                    <Link to="/classes" className="btn btn-primary">Browse More Classes</Link>
                                    <Link to="/profile" className="btn btn-ghost">View My Bookings</Link>
                                </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;

