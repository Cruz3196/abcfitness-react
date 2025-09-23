import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PurchaseCancelPage = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <XCircle className="w-24 h-24 text-warning mx-auto mb-4" />
                    <h1 className="text-5xl font-bold">Order Cancelled</h1>
                    <p className="py-6">Your payment process was cancelled. You have not been charged, and your items are still waiting for you in your cart.</p>
                    <div className="space-x-4">
                        <Link to="/cart" className="btn btn-primary">Return to Cart</Link>
                        <Link to="/products" className="btn btn-ghost">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCancelPage;

