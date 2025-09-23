import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import  useCartStore  from '../storeData/cartStore.js'; // To clear the cart
import api from '../api/axios'; // Your shared axios instance
import Spinner from '../components/common/Spinner';
import { CheckCircle, AlertTriangle } from 'lucide-react';
// import Confetti from 'react-confetti'; // Optional: install with `npm install react-confetti`

const PurchaseSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { clearCart } = useCartStore();
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError("No payment session ID found. Your purchase may not have been recorded.");
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await api.post("/payments/checkoutSuccess", { session_id: sessionId });
                if (data.success) {
                    setOrderId(data.orderId);
                    clearCart(); // Clear the cart from Zustand state
                } else {
                    setError(data.message || "Payment was not successful.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "An error occurred while verifying your payment.");
            } finally {
                setIsLoading(false);
            }
        };
        verifyPayment();
    }, [sessionId, clearCart]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    {isLoading ? (
                        <Spinner />
                    ) : error ? (
                        <>
                            <AlertTriangle className="w-24 h-24 text-error mx-auto mb-4" />
                            <h1 className="text-5xl font-bold text-error">Verification Failed</h1>
                            <p className="py-6">{error}</p>
                            <Link to="/cart" className="btn btn-error">Return to Cart</Link>
                        </>
                    ) : (
                        <>
                            {/* <Confetti recycle={false} /> */}
                            <CheckCircle className="w-24 h-24 text-success mx-auto mb-4" />
                            <h1 className="text-5xl font-bold">Thank You!</h1>
                            <p className="py-6">Your order has been placed successfully. A confirmation email is on its way.</p>
                            <p className="text-sm">Your Order ID is: <span className="font-mono badge badge-neutral">{orderId}</span></p>
                            <div className="space-x-4 mt-6">
                                <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
                                <Link to="/profile" className="btn btn-ghost">View My Orders</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;

