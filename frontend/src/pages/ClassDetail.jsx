import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import RatingCard from '../components/rating/RatingCard';
import RatingForm from '../components/rating/RatingForm';
import Spinner from '../components/common/Spinner';
import Breadcrumbs from '../components/common/Breadcrumbs';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const mockClassDetail = { 
    _id: 'class1', 
    classTitle: 'Vinyasa Flow Yoga', 
    classDescription: 'A dynamic practice that links breath with movement. Suitable for all levels, this class will build strength, flexibility, and inner peace.', 
    classPic: 'https://placehold.co/600x400/6D28D9/FFFFFF?text=Yoga', 
    trainer: { _id: 't1', user: { username: 'Jane Doe' } }, 
    timeSlot: { day: 'Tuesday', startTime: '18:00', endTime: '19:00' }, 
    capacity: 15, 
    price: 20 
};
const mockAvailableSessions = [
    { date: '2025-10-07', spotsLeft: 8 },
    { date: '2025-10-14', spotsLeft: 10 },
    { date: '2025-10-21', spotsLeft: 9 },
];
// ✅ ADDED: Mock data for reviews
const mockReviews = [
    { _id: 'r1', user: { _id: 'user1', username: 'Bob Williams', profileImage: 'https://placehold.co/100x100/60a5fa/ffffff?text=B' }, rating: 5, reviewText: 'An amazing yoga instructor! The class was challenging but accessible. Highly recommended.' },
    { _id: 'r2', user: { _id: 'user2', username: 'Diana Prince', profileImage: 'https://placehold.co/100x100/c084fc/ffffff?text=D' }, rating: 4, reviewText: 'Great flow and a wonderful atmosphere. Will be back for sure.' },
];
// This simulates the currently logged-in user to test the edit/delete buttons
const mockCurrentUser = { _id: 'user1', username: 'Bob Williams' };
// ---

const ClassDetailPage = () => {
    const { id } = useParams();
    
    // State for this page, using mock data initially
    const [classInfo, setClassInfo] = useState(null);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [reviews, setReviews] = useState([]); // ✅ ADDED: State for reviews
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setClassInfo(mockClassDetail);
            setAvailableSessions(mockAvailableSessions);
            setReviews(mockReviews); // ✅ Load mock reviews into state
            setIsLoading(false);
        }, 500);
    }, [id]);

    const handleBookClass = async (date) => {
        setIsBooking(true);
        toast.loading('Reserving your spot...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.dismiss();
        toast.success(`Successfully reserved your spot for ${date}!`);
        setIsBooking(false);
    };

    // ✅ ADDED: Handler functions for review state
    const handleReviewSubmit = (newReviewData) => {
        const newReview = {
            _id: `r${Date.now()}`,
            user: { ...mockCurrentUser, profileImage: 'https://placehold.co/100x100?text=Me' },
            ...newReviewData
        };
        setReviews([newReview, ...reviews]);
    };
    
    const handleReviewUpdate = (reviewId, updateData) => {
        setReviews(reviews.map(r => r._id === reviewId ? { ...r, ...updateData } : r));
        toast.success('Review updated!');
    };

    const handleReviewDelete = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            setReviews(reviews.filter(r => r._id !== reviewId));
            toast.success('Review deleted.');
        }
    };


    if (isLoading) {
        return <div className="flex justify-center pt-20"><Spinner /></div>;
    }

    if (!classInfo) {
        return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold">Class Not Found</h2>
            <Link to="/classes" className="btn btn-primary mt-6">Back to All Classes</Link>
        </div>
        );
    }
    
    const breadcrumbPaths = [
        { name: 'Home', link: '/' },
        { name: 'Classes', link: '/classes' },
        { name: classInfo.classTitle, link: `/classes/${id}` }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Breadcrumbs paths={breadcrumbPaths} />
            </div>

            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-2/5">
                    <img src={classInfo.classPic || 'https://placehold.co/600x400?text=Class'} alt={classInfo.classTitle} className="w-full h-full object-cover"/>
                </figure>
                <div className="card-body lg:w-3/5">
                    <h1 className="card-title text-4xl font-bold">{classInfo.classTitle}</h1>
                    <p className="mt-2">
                        Led by <Link to={`/trainers/${classInfo.trainer._id}`} className="link link-hover text-secondary">{classInfo.trainer.user.username}</Link>
                    </p>
                    <p className="text-base-content/80 my-4">{classInfo.classDescription}</p>
                    <div className="divider"></div>
                    <h2 className="text-2xl font-bold mb-4">Book Your Spot</h2>
                    <div className="space-y-3">
                        {availableSessions.map(session => (
                        <div key={session.date} className="flex justify-between items-center bg-base-200 p-4 rounded-lg">
                            <div>
                                <p className="font-semibold">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                <p className="text-sm text-base-content/70">{classInfo.timeSlot.startTime} - {session.spotsLeft} spots left</p>
                            </div>
                            <button onClick={() => handleBookClass(session.date)} className="btn btn-primary" disabled={isBooking}>
                                {isBooking ? 'Booking...' : `Book for $${classInfo.price}`}
                            </button>
                        </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- INTEGRATED RATING & REVIEW SECTION --- */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">What Our Members Say</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <RatingCard 
                                key={review._id} 
                                review={review} 
                                currentUser={mockCurrentUser}
                                onUpdate={handleReviewUpdate}
                                onDelete={handleReviewDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-base-content/70">Be the first to review this class!</p>
                )}
                {/* We pass the handleReviewSubmit function to the form */}
                <RatingForm classId={id} onSubmit={handleReviewSubmit} />
            </div>
        </div>
    );
};

export default ClassDetailPage;

