import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Users, DollarSign, ArrowLeft } from 'lucide-react';
import RatingCard from '../components/rating/RatingCard';
import RatingForm from '../components/rating/RatingForm';
import Spinner from '../components/common/Spinner';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { classStore } from '../storeData/classStore';
import { userStore } from '../storeData/userStore';
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

    // Mock reviews for now
    const [reviews] = useState([
        { 
            _id: 'r1', 
            user: { _id: 'user1', username: 'Bob Williams', profileImage: 'https://placehold.co/100x100/60a5fa/ffffff?text=B' }, 
            rating: 5, 
            reviewText: 'An amazing class! The instructor was knowledgeable and the workout was challenging but accessible.' 
        },
        { 
            _id: 'r2', 
            user: { _id: 'user2', username: 'Diana Prince', profileImage: 'https://placehold.co/100x100/c084fc/ffffff?text=D' }, 
            rating: 4, 
            reviewText: 'Great experience and wonderful atmosphere. Will definitely be back!' 
        },
    ]);

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
        
        // ✅ Use classStore's bookClass function
        const result = await bookClass(id, session.date);

        if (result.success) {
            // Add the session to booked sessions
            const newBookedSessions = new Set([...bookedSessions, session.date]);
            setBookedSessions(newBookedSessions);
            
            // Persist to localStorage
            const storageKey = getStorageKey();
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify([...newBookedSessions]));
            }
            
            // Create booking object for the modal
            const newBooking = {
                _id: result.booking._id,
                class: selectedClass,
                sessionDate: result.sessionDate,
                status: 'upcoming'
            };
            setLatestBooking(newBooking);
            
            // ✅ Refresh user's bookings in userStore
            await fetchMyBookings();
        }
    };

    // Function to determine button state
    const getButtonState = (session) => {
        const isBooked = bookedSessions.has(session.date);
        const isFull = session.spotsLeft === 0;
        
        if (isBooked) {
            return {
                text: 'Booked!',
                disabled: true,
                className: 'btn btn-success',
                icon: '✓'
            };
        } else if (isFull) {
            return {
                text: 'Full',
                disabled: true,
                className: 'btn btn-disabled',
                icon: null
            };
        } else if (isBooking) {
            return {
                text: 'Booking...',
                disabled: true,
                className: 'btn btn-primary',
                icon: null
            };
        } else {
            return {
                text: `Book for $${selectedClass.price}`,
                disabled: false,
                className: 'btn btn-primary',
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
                        <div className="space-y-3">
                            {availableSessions.map(session => {
                                const buttonState = getButtonState(session);
                                
                                return (
                                    <div key={session.date} className="flex justify-between items-center bg-base-200 p-4 rounded-lg">
                                        <div>
                                            <p className="font-semibold">
                                                {new Date(session.date).toLocaleDateString(undefined, { 
                                                    weekday: 'long', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            <p className="text-sm text-base-content/70">
                                                {session.startTime} - {session.endTime} ({session.duration} mins) • {session.spotsLeft} spots left
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleBookClass(session)}
                                            className={buttonState.className}
                                            disabled={buttonState.disabled}
                                        >
                                            {isBooking ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    {buttonState.text}
                                                </>
                                            ) : (
                                                <>
                                                    {buttonState.icon && <span className="mr-1">{buttonState.icon}</span>}
                                                    {buttonState.text}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-base-content/70">No upcoming sessions available for this class.</p>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">What Our Members Say</h2>
                    {reviews.length > 0 ? (
                        <div className="space-y-6 mb-8">
                            {reviews.map(review => (
                                <RatingCard 
                                    key={review._id} 
                                    review={review} 
                                    currentUser={user}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-base-content/70 mb-6">Be the first to review this class!</p>
                    )}
                    
                    {user && (
                        <RatingForm classId={id} />
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