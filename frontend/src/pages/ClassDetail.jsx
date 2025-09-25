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

const ClassDetailPage = () => {
    const { id } = useParams();
    const { user } = userStore();
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

    // Mock reviews for now - you can implement real reviews later
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

    useEffect(() => {
        if (id) {
            fetchClassById(id);
        }

        return () => {
            clearSelectedClass();
        };
    }, [id, fetchClassById, clearSelectedClass]);

    const handleBookClass = async (date) => {
        if (!user) {
            toast.error('Please log in to book a class');
            return;
        }
        
        const success = await bookClass(id, date);
        if (success) {
            // Optionally redirect or show success message
        }
    };

    const handleReviewSubmit = (newReviewData) => {
        // This would normally save to backend
        console.log('New review:', newReviewData);
    };

    const handleReviewUpdate = (reviewId, updateData) => {
        console.log('Update review:', reviewId, updateData);
    };

    const handleReviewDelete = (reviewId) => {
        console.log('Delete review:', reviewId);
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
                        <Link 
                            to={`/trainers/${selectedClass.trainer._id}`} 
                            className="link link-hover text-secondary font-semibold"
                        >
                            {selectedClass.trainer.user.username}
                        </Link>
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
                            {availableSessions.map(session => (
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
                                            {session.startTime} - {session.spotsLeft} spots left
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleBookClass(session.date)} 
                                        className="btn btn-primary" 
                                        disabled={isBooking || session.spotsLeft === 0}
                                    >
                                        {isBooking ? (
                                            <>
                                                <span className="loading loading-spinner loading-sm"></span>
                                                Booking...
                                            </>
                                        ) : session.spotsLeft === 0 ? (
                                            'Full'
                                        ) : (
                                            `Book for $${selectedClass.price}`
                                        )}
                                    </button>
                                </div>
                            ))}
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
                                    onUpdate={handleReviewUpdate}
                                    onDelete={handleReviewDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-base-content/70 mb-6">Be the first to review this class!</p>
                    )}
                    
                    {user && (
                        <RatingForm classId={id} onSubmit={handleReviewSubmit} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassDetailPage;