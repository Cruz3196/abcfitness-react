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
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const { clearCart } = useCartStore();
    const hasProcessed = useRef(false);

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
        const handleCheckoutSuccess = async (sessionId) => {
            if (hasProcessed.current) {
                console.log('Already processed, skipping...');
                return;
            }
            
            hasProcessed.current = true;

            try {
                const response = await axios.post('/payment/checkoutSuccess', {
                    session_id: sessionId
                });

                if (response.data.success) {
                    setOrderId(response.data.orderId);
                    clearCart();
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

        const sessionId = new URLSearchParams(window.location.search).get('session_id');
        if (sessionId) {
            handleCheckoutSuccess(sessionId);
        } else {
            setIsProcessing(false);
            setError('No session ID found in the URL');
        }
    }, []);

    if (isProcessing) {
        return (
            <div className="hero min-h-screen bg-base-200 px-4">
                <div className="hero-content text-center">
                    <div className="max-w-md w-full">
                        <Spinner />
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4">
                            Processing your order...
                        </h1>
                        <p className="py-4 text-sm sm:text-base">
                            Please wait while we confirm your payment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="hero min-h-screen bg-base-200 px-4">
                <div className="hero-content text-center">
                    <div className="max-w-md w-full">
                        <div className="text-error mb-4">
                            <svg 
                                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path 
                                    fillRule="evenodd" 
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                                    clipRule="evenodd" 
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-error">
                            Payment Error
                        </h1>
                        <p className="py-4 text-sm sm:text-base">{error}</p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link 
                                to="/cart" 
                                className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                            >
                                Back to Cart
                            </Link>
                            <Link 
                                to="/store" 
                                className="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="hero min-h-screen bg-base-200 px-4">
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                gravity={0.1}
                numberOfPieces={windowSize.width < 768 ? 400 : 700}
                recycle={false}
            />
            <div className="hero-content text-center">
                <div className="max-w-md w-full">
                    <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-success mx-auto mb-4" />
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-success mb-4">
                        Order Successful!
                    </h1>
                    
                    <p className="py-4 sm:py-6 text-sm sm:text-base">
                        Thank you for your purchase! Your order has been confirmed and you should receive an email confirmation shortly.
                    </p>
                    
                    {orderId && (
                        <div className="alert alert-info mb-4 sm:mb-6 text-left">
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="text-sm sm:text-base break-all">
                                Order ID: <strong>{orderId}</strong>
                            </span>
                        </div>
                    )}
                    
                    <div className="space-y-3 sm:space-y-4">
                        <Link 
                            to="/profile" 
                            className="btn btn-primary btn-sm sm:btn-md w-full sm:btn-wide"
                        >
                            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="ml-2">View Order History</span>
                        </Link>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link 
                                to="/store" 
                                className="btn btn-ghost btn-sm sm:btn-md w-full sm:w-auto"
                            >
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