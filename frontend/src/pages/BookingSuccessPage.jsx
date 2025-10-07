import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { userStore } from '../storeData/userStore';
import Confetti from 'react-confetti';

const BookingSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { fetchMyBookings } = userStore();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const verifyBooking = async () => {
            if (!sessionId) {
                setError("No booking session ID found.");
                setIsLoading(false);
                return;
            }
            try {
                console.log('Verifying payment and creating booking...');
                
                // posting class checkout success to the backend
                await api.post('/payment/classCheckoutSuccess', { 
                    session_id: sessionId 
                });
                
                // Fetch updated bookings
                await fetchMyBookings();
                
                // Show confetti on success
                setShowConfetti(true);
                
                // Stop confetti after 5 seconds
                setTimeout(() => setShowConfetti(false), 5000);
                
            } catch (err) {
                console.error('Booking verification error:', err);
                setError(err.response?.data?.message || "An error occurred while confirming your booking.");
            } finally {
                setIsLoading(false);
            }
        };
        verifyBooking();
    }, [sessionId, fetchMyBookings]);

    return (
        <>
            {showConfetti && <Confetti />}
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        {isLoading ? (
                            <div>
                                <Spinner />
                                <p className="mt-4">Processing your booking...</p>
                            </div>
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
                                <h1 className="text-5xl font-bold text-success">🎉 Booking Confirmed!</h1>
                                <p className="py-6">
                                    Your payment was successful and your spot is secured! 
                                    We've sent a confirmation email with all the details.
                                </p>
                                <div className="space-x-4 mt-6">
                                    <Link to="/profile" className="btn btn-primary">View My Bookings</Link>
                                    <Link to="/classes" className="btn btn-ghost">Browse More Classes</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingSuccessPage;