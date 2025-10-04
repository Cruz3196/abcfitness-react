import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, DollarSign, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
// import RatingCard from '../components/rating/RatingCard';
// import RatingForm from '../components/rating/RatingForm';
import Spinner from '../components/common/Spinner';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { classStore } from '../storeData/classStore';
import { userStore } from '../storeData/userStore';
import { reviewStore } from '../storeData/reviewStore';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import BookingCard from '../components/user/BookingCard';

// ✅ Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51S9WGyIEpMTZmgDrULbvg0KMshtzSdkQmHiojffBNMBXnxcO6XPk4TkVrramUD783saSb1y5LLmEnRUifA8B7nUm00VYLvV1Ag");

const ClassDetail = () => {
    const { id } = useParams();
    const { user, fetchMyBookings } = userStore();
    const [latestBooking, setLatestBooking] = useState(null);
    const [bookedSessions, setBookedSessions] = useState(new Set());
    const [isProcessing, setIsProcessing] = useState(false);
    
    const { 
        selectedClass, 
        availableSessions, 
        isLoading, 
        isBooking, 
        error, 
        fetchClassById, 
        bookClass,
        clearSelectedClass 
    } = classStore();

    // fetching from the review store 
    const { 
        reviews, 
        isLoading: reviewsLoading, 
        isSubmitting,
        fetchReviewsByClass,
        submitReview,
        updateReview,
        deleteReview,
        clearReviews
    } = reviewStore();

    // ✅ Fetch reviews when component mounts
    useEffect(() => {
        if (id) {
            fetchReviewsByClass(id);
        }
        
        // Cleanup when leaving the page
        return () => {
            clearReviews();
        };
    }, [id, fetchReviewsByClass, clearReviews]);

    // ✅ Handle review submission
    const handleReviewSubmit = async (reviewData) => {
        if (!user) {
            toast.error('Please log in to submit a review');
            return;
        }
        
        const result = await submitReview(id, reviewData);
        return result;
    };

    // ✅ Handle review update
    const handleReviewUpdate = async (reviewId, updateData) => {
        const result = await updateReview(reviewId, updateData);
        return result;
    };

    // ✅ Handle review deletion
    const handleReviewDelete = async (reviewId) => {
        const result = await deleteReview(reviewId);
        return result;
    };

    // Function to generate a unique localStorage key per user and class
    const getStorageKey = () => {
        if (user && id) {
            return `booked_${user._id}_${id}`;
        }
        return null;
    };

    useEffect(() => {
        if (id) {
            fetchClassById(id);
        }
        return () => {
            // clearSelectedClass();
            setBookedSessions(new Set());
        };
    }, [id, fetchClassById]);

    // Check localStorage for booked sessions
    useEffect(() => {
        const storageKey = getStorageKey();
        if (storageKey) {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                try {
                    const bookedDates = JSON.parse(stored);
                    setBookedSessions(new Set(bookedDates));
                } catch (error) {
                    console.error('Error parsing stored bookings:', error);
                    localStorage.removeItem(storageKey);
                }
            }
        }
    }, [id, user]);

    // Sync with user's actual bookings from server
useEffect(() => {
    if (user && selectedClass && user.bookings) { // ✅ Use 'bookings' not 'upcomingBookings'
        // ✅ Only count bookings that are NOT cancelled
        const userBookedDatesForThisClass = new Set(
            user.bookings
                .filter(booking => 
                    booking.class?._id === selectedClass._id && 
                    booking.status !== 'cancelled' && // ✅ Exclude cancelled bookings
                    booking.paymentStatus === 'paid'   // ✅ Only count paid bookings
                )
                .map(booking => new Date(booking.sessionDate).toISOString().split('T')[0])
        );
        
        setBookedSessions(userBookedDatesForThisClass);

        // Sync localStorage with server state
        const storageKey = getStorageKey();
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify([...userBookedDatesForThisClass]));
        }
    }
}, [user?.bookings, selectedClass]) // ✅ Listen specifically to bookings changes

    // ✅ Updated handleBookClass with Stripe integration
    const handleBookClass = async (session) => {
        if (!user) {
            toast.error('Please log in to book a class');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            console.log('Creating checkout session for:', { classId: id, sessionDate: session.date });
            
            // ✅ Create Stripe checkout session directly (no booking yet)
            const response = await axios.post('/payment/createClassCheckoutSession', {
                classId: id,
                sessionDate: session.date
            });

            const sessionData = response.data;
            console.log('✅ Stripe session created:', sessionData);

            // ✅ Redirect to Stripe checkout
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: sessionData.id
            });

            if (result.error) {
                console.error('Stripe error:', result.error);
                toast.error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Failed to process payment');
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to determine button state
    const getButtonState = (session) => {
        const sessionDateString = session.date;
        const isBooked = bookedSessions.has(sessionDateString);
        const isFull = session.spotsLeft <= 0;
        const isPast = new Date(session.date) < new Date();
        
        if (isPast) {
            return {
                text: 'Past Session',
                disabled: true,
                className: 'btn btn-disabled',
                icon: null
            };
        } else if (isBooked) {
            return {
                text: 'Already Booked',
                disabled: true,
                className: 'btn btn-success',
                icon: '✓'
            };
        } else if (isFull) {
            return {
                text: 'Class Full',
                disabled: true,
                className: 'btn btn-error',
                icon: null
            };
        } else if (isProcessing) {
            return {
                text: (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                    </>
                ),
                disabled: true,
                className: 'btn btn-primary',
                icon: null
            };
        } else {
            return {
                text: (
                    <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Reserve Spot - ${selectedClass.price}
                    </>
                ),
                disabled: false,
                className: 'btn btn-primary',
                icon: null
            };
        }
    };

    if (isLoading) {
        return <div className="flex justify-center pt-20"><Spinner /></div>;
    }

    if (error || !selectedClass) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4">
                    {error || 'Class Not Found'}
                </h2>
                <Link to="/classes" className="btn btn-primary">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to All Classes
                </Link>
            </div>
        );
    }
    
    const breadcrumbPaths = [
        { name: 'Home', link: '/' },
        { name: 'Classes', link: '/classes' },
        { name: selectedClass.classTitle, link: `/classes/${id}` }
    ];

    const trainerName = selectedClass.trainer?.user?.username || 'Unknown Trainer';
    const trainerId = selectedClass.trainer?._id;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs paths={breadcrumbPaths} />
            </div>

            {/* Class Info Card */}
            <motion.div 
                className="card lg:card-side bg-base-100 shadow-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <figure className="lg:w-2/5">
                    <img 
                        src={selectedClass.classPic || 'https://placehold.co/600x400?text=Class'} 
                        alt={selectedClass.classTitle} 
                        className="w-full h-full object-cover"
                    />
                </figure>
                <div className="card-body lg:w-3/5">
                    <div className="badge badge-secondary mb-2">{selectedClass.classType}</div>
                    <h1 className="card-title text-4xl font-bold">{selectedClass.classTitle}</h1>
                    <p className="mt-2">
                        Led by{' '}
                        {trainerId ? (
                            <Link 
                                to={`/trainers/${trainerId}`} 
                                className="link link-hover text-secondary font-semibold"
                            >
                                {trainerName}
                            </Link>
                        ) : (
                            <span className="text-secondary font-semibold">{trainerName}</span>
                        )}
                    </p>
                    <p className="text-base-content/80 my-4">{selectedClass.classDescription}</p>
                    
                    {/* Class Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-primary" />
                            <span className="text-sm">{selectedClass.timeSlot?.day}s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <span className="text-sm">{selectedClass.duration} minutes</span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <span className="text-sm">{selectedClass.capacity} max capacity</span>
                        </div> */}
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-primary" />
                            <span className="text-sm">${selectedClass.price} per session</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Booking Section */}
            <motion.div 
                className="card bg-base-100 shadow-xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Book Your Spot</h2>
                    
                    {!user && (
                        <div className="alert alert-warning mb-4">
                            <span>Please log in to book a class</span>
                        </div>
                    )}
                    
                    {availableSessions.length > 0 ? (
                        <div className="space-y-4">
                            {availableSessions.map((session, index) => {
                                const buttonState = getButtonState(session);
                                const isBooked = bookedSessions.has(session.date);
                                const isFull = session.spotsLeft <= 0;
                                const isPast = new Date(session.date) < new Date();
                                
                                return (
                                    <motion.div 
                                        key={session.date}
                                        className="card bg-base-200 shadow-sm border border-base-300"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="card-body p-6">
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={18} className="text-primary" />
                                                            <span className="font-semibold text-lg">
                                                                {new Date(session.date).toLocaleDateString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={18} className="text-primary" />
                                                            <span className="font-medium">
                                                                {session.startTime} - {session.endTime}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-6 text-sm text-base-content/70">
                                                        {/* <div className="flex items-center gap-1">
                                                            <Users size={16} />
                                                            <span>
                                                                <span className={`font-semibold ${
                                                                    isFull ? 'text-error' : 'text-success'
                                                                }`}>
                                                                    {session.spotsLeft}
                                                                </span> spots left
                                                            </span>
                                                        </div> */}
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign size={16} />
                                                            <span>{selectedClass.price} per session</span>
                                                        </div>
                                                        <div className="text-xs">
                                                            {selectedClass.duration} minutes
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button
                                                    className={`${buttonState.className} min-w-[200px]`}
                                                    onClick={() => handleBookClass(session)}
                                                    disabled={buttonState.disabled || !user}
                                                >
                                                    {buttonState.text}
                                                </button>
                                            </div>
                                            
                                            {/* Progress bar for spots */}
                                            <div className="mt-4">
                                                {/* <div className="flex justify-between text-xs mb-2">
                                                    <span>Capacity</span>
                                                    <span>{selectedClass.capacity - session.spotsLeft}/{selectedClass.capacity}</span>
                                                </div> */}
                                                <progress 
                                                    className="progress progress-primary w-full" 
                                                    value={selectedClass.capacity - session.spotsLeft} 
                                                    max={selectedClass.capacity}
                                                ></progress>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-base-content/60">
                                <h3 className="text-xl font-semibold mb-4">No Sessions Available</h3>
                                <p>No upcoming sessions available for this class.</p>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-center mt-6">
                        <p className="text-xs text-base-content/70">
                            Secure payment powered by Stripe • Full refund if cancelled 24h before class
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Reviews Section */}
            {/* <motion.div 
                className="card bg-base-100 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">What Our Members Say</h2>
                    
                    {reviewsLoading ? (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-6 mb-8">
                            {reviews.map(review => (
                                <RatingCard 
                                    key={review._id} 
                                    review={review} 
                                    currentUser={user}
                                    onUpdate={handleReviewUpdate}
                                    onDelete={handleReviewDelete}
                                    isSubmitting={isSubmitting}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-base-content/70 mb-6">Be the first to review this class!</p>
                    )}
                    
                    {user && (
                        <RatingForm 
                            classId={id} 
                            onSubmit={handleReviewSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </div>
            </motion.div> */}

            {/* Booking Confirmation Modal */}
            {latestBooking && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-2xl text-success mb-4">Booking Confirmed! 🎉</h3>
                        <p className="pb-4">You're all set. Here are the details for your class:</p>
                        
                        <BookingCard booking={latestBooking} isHistory={false} />
                        
                        <div className="modal-action">
                            <Link to="/profile" className="btn btn-outline">
                                Continue to My Profile
                            </Link>
                            <button
                                onClick={() => setLatestBooking(null)}
                                className="btn btn-primary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetail;