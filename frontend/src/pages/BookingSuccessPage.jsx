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
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // Handle window resize for confetti
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            {showConfetti && (
                <Confetti 
                    width={windowSize.width}
                    height={windowSize.height}
                    gravity={0.1}
                    numberOfPieces={windowSize.width < 768 ? 400 : 700}
                    recycle={false}
                />
            )}
            <div className="hero min-h-screen bg-base-200 px-4">
                <div className="hero-content text-center">
                    <div className="max-w-md w-full">
                        {isLoading ? (
                            <div>
                                <Spinner />
                                <p className="mt-4 text-sm sm:text-base">
                                    Processing your booking...
                                </p>
                            </div>
                        ) : error ? (
                            <>
                                <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-error mx-auto mb-4" />
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-error mb-4">
                                    Booking Failed
                                </h1>
                                <p className="py-4 sm:py-6 text-sm sm:text-base">
                                    {error}
                                </p>
                                <Link 
                                    to="/classes" 
                                    className="btn btn-error btn-sm sm:btn-md w-full sm:w-auto"
                                >
                                    Return to Classes
                                </Link>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-success mx-auto mb-4" />
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-success mb-4">
                                    🎉 Booking Confirmed!
                                </h1>
                                <p className="py-4 sm:py-6 text-sm sm:text-base">
                                    Your payment was successful and your spot is secured!
                                    We've sent a confirmation email with all the details.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center">
                                    <Link 
                                        to="/profile" 
                                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                                    >
                                        View My Bookings
                                    </Link>
                                    <Link 
                                        to="/classes" 
                                        className="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
                                    >
                                        Browse More Classes
                                    </Link>
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