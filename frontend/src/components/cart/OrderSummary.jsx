import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import useCartStore from '../../storeData/cartStore';
import { userStore } from '../../storeData/userStore';
import axios from '../../api/axios';
import toast from 'react-hot-toast';



const stripePromise = loadStripe("pk_test_51S9WGyIEpMTZmgDrULbvg0KMshtzSdkQmHiojffBNMBXnxcO6XPk4TkVrramUD783saSb1y5LLmEnRUifA8B7nUm00VYLvV1Ag");

const OrderSummary = ({ customerInfo }) => {
    const { cart, subtotal } = useCartStore();
    const { user, checkAuthStatus } = userStore();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            checkAuthStatus();
        }
    }, [user, checkAuthStatus]);

const handleCheckout = async () => {
    if (!user) {
        toast.error('Please log in to complete your purchase');
        return;
    }

    if (cart.length === 0) {
        toast.error('Your cart is empty');
        return;
    }

    setIsProcessing(true);

    try {
        console.log('Sending checkout request...');
        
        const response = await axios.post('/payment/createCheckoutSession', {
            products: cart.map(item => ({
                _id: item._id,
                productName: item.productName,
                productPrice: item.productPrice || item.price,
                quantity: item.quantity,
                img: item.productImage || item.img
            }))
        });

        const session = response.data;

        if (session.url) {
            window.location.href = session.url;
        } else {
            toast.error('No checkout URL received');
            setIsProcessing(false);
        }

    } catch (error) {
        console.error('Checkout error:', error);
        
        if (error.response?.status === 401) {
            toast.error('Your session has expired. Please log in again.');
        } else if (error.response?.status === 500) {
            toast.error('Server error. Please try again in a moment.');
        } else {
            toast.error(error.response?.data?.message || 'Failed to process checkout');
        }
        
        setIsProcessing(false);
    }
};

    const taxes = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const finalTotal = subtotal + taxes + shipping;

    return (
        <motion.div 
            className="card bg-base-100 shadow-xl sticky top-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Order Summary</h2>
                
                {!user && (
                    <div className="alert alert-warning mb-4">
                        <span>Please log in to complete your purchase</span>
                    </div>
                )}
                
                <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                        <div key={item._id} className="flex items-start gap-3">
                            {/* Product Image */}
                            <img
                                src={item.productImage || item.img}
                                alt={item.productName}
                                className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                        
                            {/* Product Info - Can expand */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm sm:text-base break-words">
                                {item.productName}
                                </p>
                                <p className="text-xs text-base-content/70 mt-0.5">
                                Qty: {item.quantity}
                                </p>
                            </div>
                        
                            {/* Price - Fixed width on right */}
                            <div className="text-right flex-shrink-0">
                                <p className="font-semibold text-sm sm:text-base whitespace-nowrap">
                                ${((item.productPrice || item.price) * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="divider"></div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes</span>
                        <span>${taxes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                        className="btn btn-primary btn-md w-52 mt-5"
                        onClick={handleCheckout}
                        disabled={isProcessing || cart.length === 0 || !user}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Processing...
                            </>
                        ) : !user ? (
                            'Please Log In'
                        ) : (
                            <>
                                <CreditCard className="w-5 h-5 mr-2" />
                                Proceed to Checkout
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center mt-4">
                    <p className="text-xs text-base-content/70">
                        Secure checkout powered by Stripe
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;