import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import useCartStore from '../storeData/cartStore';
import axios from '../api/axios';
import Spinner from '../components/common/Spinner';
import Confetti from 'react-confetti';

const PurchaseSuccessPage = () => {
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const { clearCart } = useCartStore();
    
    // ✅ Prevent multiple API calls
    const hasProcessed = useRef(false);

    useEffect(() => {
        const handleCheckoutSuccess = async (sessionId) => {
            // ✅ Prevent duplicate calls
            if (hasProcessed.current) {
                console.log('Already processed, skipping...');
                return;
            }
            
            hasProcessed.current = true;

            try {
                console.log('🚀 Verifying payment with session ID:', sessionId);
                
                const response = await axios.post('/payment/checkoutSuccess', {
                    session_id: sessionId
                });

                console.log('✅ Payment verification response:', response.data);

                if (response.data.success) {
                    setOrderId(response.data.orderId);
                    clearCart(); // Clear the cart after successful payment
                } else {
                    setError('Payment verification failed');
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setError(error.response?.data?.message || 'Failed to verify payment');
            } finally {
                setIsProcessing(false);
            }
        };

        // Get session_id from URL parameters
        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError('No session ID found in the URL');
        }
    }, []); // ✅ Remove clearCart from dependencies to prevent re-runs

    if (isProcessing) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <Spinner />
                        <h1 className="text-2xl font-bold mt-4">Processing your order...</h1>
                        <p className="py-4">Please wait while we confirm your payment.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <div className="text-error mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-error">Payment Error</h1>
                        <p className="py-4">{error}</p>
                        <div className="space-x-4">
                            <Link to="/cart" className="btn btn-primary">Back to Cart</Link>
                            <Link to="/store" className="btn btn-ghost">Continue Shopping</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                gravity={0.1}
                numberOfPieces={700}
                recycle={false}
            />
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <CheckCircle className="w-24 h-24 text-success mx-auto mb-4" />
                    <h1 className="text-5xl font-bold text-success">Order Successful!</h1>
                    <p className="py-6">
                        Thank you for your purchase! Your order has been confirmed and you should receive an email confirmation shortly.
                    </p>
                    
                    {orderId && (
                        <div className="alert alert-info mb-6">
                            <Package className="w-5 h-5" />
                            <span>Order ID: <strong>{orderId}</strong></span>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <Link 
                            to="/profile" 
                            className="btn btn-primary btn-wide"
                        >
                            <Package className="w-5 h-5 mr-2" />
                            View Order History
                        </Link>
                        
                        <div className="flex gap-4 justify-center">
                            <Link to="/store" className="btn btn-ghost">
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;