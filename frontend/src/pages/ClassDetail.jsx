import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Users, DollarSign, ArrowLeft } from 'lucide-react';
import RatingCard from '../components/rating/RatingCard';
import RatingForm from '../components/rating/RatingForm';
import Spinner from '../components/common/Spinner';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { classStore } from '../storeData/classStore';
import { userStore } from '../storeData/userStore';
import { reviewStore } from '../storeData/reviewStore';
import toast from 'react-hot-toast';
import BookingCard from '../components/user/BookingCard';

const ClassDetail = () => {
    const { id } = useParams();
    const { user, fetchMyBookings } = userStore();
    const [latestBooking, setLatestBooking] = useState(null);
    const [bookedSessions, setBookedSessions] = useState(new Set());
    
    const { 
        selectedClass, 
        availableSessions, 
        isLoading, 
        isBooking, 
        error, 
        fetchClassById, 
        bookClass, // ✅ Now using classStore's bookClass
        clearSelectedClass 
    } = classStore();

    // fetching from the review store 
        // ✅ Add review store state
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
            clearSelectedClass();
            setBookedSessions(new Set());
        };
    }, [id, fetchClassById, clearSelectedClass]);

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
        if (user && selectedClass && user.upcomingBookings) {
            const userBookedDatesForThisClass = new Set(
                user.upcomingBookings
                    .filter(booking => booking.class?._id === selectedClass._id)
                    .map(booking => new Date(booking.sessionDate).toISOString().split('T')[0])
            );
            
            setBookedSessions(userBookedDatesForThisClass);

            // Sync localStorage with server state
            const storageKey = getStorageKey();
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify([...userBookedDatesForThisClass]));
            }
        }
    }, [user, selectedClass]);

    const handleBookClass = async (session) => {
        if (!user) {
            toast.error('Please log in to book a class');
            return;
        }
        
        // ✅ Use unique session identifier
        const sessionKey = session.sessionKey || `${session.date}_${session.startTime}`;
        
        const result = await bookClass(id, session.date);

        if (result.success) {
            // ✅ Track individual session bookings
            const newBookedSessions = new Set([...bookedSessions, sessionKey]);
            setBookedSessions(newBookedSessions);
            
            // ✅ Persist to localStorage with user-specific key
            const storageKey = `booked_sessions_${user._id}_${id}`;
            localStorage.setItem(storageKey, JSON.stringify([...newBookedSessions]));
            
            setLatestBooking({
                _id: result.booking._id,
                class: selectedClass,
                sessionDate: result.sessionDate,
                status: 'upcoming'
            });
            
            // ✅ Refresh user bookings
            await fetchMyBookings();
        }
    };

    // Function to determine button state
    const getButtonState = (session) => {
        const sessionKey = session.sessionKey || `${session.date}_${session.startTime}`;
        const isBooked = bookedSessions.has(sessionKey);
        const isFull = session.spotsLeft <= 0;
        const isPast = new Date(session.date) < new Date();
        
        if (isPast) {
            return {
                text: 'Past Session',
                disabled: true,
                className: 'btn btn-disabled btn-sm',
                icon: null
            };
        } else if (isBooked) {
            return {
                text: 'Booked ✓',
                disabled: true,
                className: 'btn btn-success btn-sm',
                icon: '✓'
            };
        } else if (isFull) {
            return {
                text: 'Full',
                disabled: true,
                className: 'btn btn-disabled btn-sm',
                icon: null
            };
        } else if (isBooking) {
            return {
                text: 'Booking...',
                disabled: true,
                className: 'btn btn-primary btn-sm loading',
                icon: null
            };
        } else {
            return {
                text: `Book for $${selectedClass.price}`,
                disabled: false,
                className: 'btn btn-primary btn-sm',
                icon: null
            };
        }
    };

    // ... rest of the handlers remain the same ...

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

            <div className="card lg:card-side bg-base-100 shadow-xl mb-8">
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
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <span className="text-sm">{selectedClass.capacity} max capacity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} className="text-primary" />
                            <span className="text-sm">${selectedClass.price} per session</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Section */}
        <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Book Your Spot</h2>
                {availableSessions.length > 0 ? (
                    <div className="space-y-1">
                        {availableSessions.map(session => {
                            const isBooked = bookedSessions.has(session.date);
                            const isFull = session.spotsLeft <= 0;
                            const isPast = new Date(session.date) < new Date();
                            
                            return (
                                <div key={session.date} className="bg-base-100 border-b border-base-300 py-6 hover:bg-base-50 transition-colors">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                        {/* Date */}
                                        <div className="lg:col-span-3">
                                            <h3 className="text-lg font-bold">
                                                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                            </h3>
                                            <div className="text-sm opacity-70">
                                                {new Date(session.date).toLocaleDateString('en-US', { 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </div>

                                        {/* Time */}
                                        <div className="lg:col-span-3">
                                            <div className="text-primary font-semibold">
                                                {session.startTime} - {session.endTime}
                                            </div>
                                            <div className="text-sm opacity-70">
                                                {session.duration} minutes
                                            </div>
                                        </div>

                                        {/* Spots Available */}
                                        <div className="lg:col-span-3">
                                            <div className="text-sm">
                                                <span className={`font-semibold ${
                                                    isFull ? 'text-error' : 'text-success'
                                                }`}>
                                                    {session.spotsLeft} / {selectedClass.capacity} spots left
                                                </span>
                                            </div>
                                        </div>

                                        {/* Single Reserve Button - matching ClassSchedule */}
                                        <div className="lg:col-span-3 flex justify-end">
                                            <button
                                                onClick={() => handleBookClass(session)}
                                                className={`btn ${
                                                    isPast || isFull || isBooked ? 'btn-disabled' : 'btn-primary'
                                                }`}
                                                disabled={isPast || isFull || isBooked || isBooking}
                                            >
                                                {isBooking ? 'Booking...' :
                                                isPast ? 'Past Session' :
                                                isBooked ? 'Already Booked' :
                                                isFull ? 'Class Full' :
                                                'Reserve Spot'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
            </div>
        </div>

            {/* Reviews Section */}
            <div className="card bg-base-100 shadow-xl">
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
            </div>

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