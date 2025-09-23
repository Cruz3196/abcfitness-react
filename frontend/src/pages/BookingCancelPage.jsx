import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const BookingCancelPage = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <XCircle className="w-24 h-24 text-warning mx-auto mb-4" />
                    <h1 className="text-5xl font-bold">Booking Cancelled</h1>
                    <p className="py-6">Your booking payment was cancelled. You have not been charged and your spot was not reserved.</p>
                    <Link to="/classes" className="btn btn-primary">Return to Classes</Link>
                </div>
            </div>
        </div>
    );
};

export default BookingCancelPage;

