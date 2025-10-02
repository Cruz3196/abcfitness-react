import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import useCartStore from '../../storeData/cartStore';
import { userStore } from '../../storeData/userStore';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import CustomerInfo from './CustomerInfo';



// ✅ Use Vite environment variable syntax
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
            
            // ✅ Make the request to your backend
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
            console.log('✅ Session created:', session);

            // ✅ Use Stripe to redirect to checkout
            const stripe = await stripePromise;
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });

            if (result.error) {
                console.error('Stripe error:', result.error);
                toast.error(result.error.message);
            }

        } catch (error) {
            console.error('Checkout error:', error);
            toast.error(error.response?.data?.message || 'Failed to process checkout');
        } finally {
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
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                        <div key={item._id} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <img 
                                    src={item.productImage || item.img} 
                                    alt={item.productName}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                    <p className="font-medium text-sm">{item.productName}</p>
                                    <p className="text-xs text-base-content/70">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold">
                                ${((item.productPrice || item.price) * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="divider"></div>

                {/* Pricing Breakdown */}
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

                {/* Checkout Button */}
                <button 
                    className="btn btn-primary btn-lg w-full mt-6"
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