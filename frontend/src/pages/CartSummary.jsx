import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrderSummary from '../components/cart/OrderSummary';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import useCartStore from '../storeData/cartStore';

const CartSummary = () => {
    const { cartItems, clearCart, getTotalPrice, getTotalItems } = useCartStore();

    const handleCheckout = () => {
        console.log('Proceeding to checkout...');
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            clearCart();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="min-h-screen bg-base-200 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-base-100 p-6 rounded-lg shadow-lg"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <ShoppingCart className="w-8 h-8 text-primary" />
                        <h1 className="text-4xl font-bold text-base-content">
                            Shopping Cart
                        </h1>
                        {cartItems.length > 0 && (
                            <div className="badge badge-primary badge-lg">
                                {getTotalItems()} items
                            </div>
                        )}
                    </div>
                    <Link 
                        to="/store" 
                        className="btn btn-outline btn-primary gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                </motion.div>

                {/* Cart Content */}
                {cartItems.length === 0 ? (
                    <motion.div 
                        className="text-center py-16"
                        variants={itemVariants}
                    >
                        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
                            <div className="card-body items-center text-center">
                                <ShoppingCart className="w-24 h-24 text-base-300 mb-4" />
                                <h2 className="card-title text-2xl mb-4">Your cart is empty</h2>
                                <p className="text-base-content/70 mb-6">
                                    Looks like you haven't added any fitness products yet.
                                </p>
                                <Link to="/store" className="btn btn-primary btn-wide">
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <motion.div 
                            className="lg:col-span-2"
                            variants={itemVariants}
                        >
                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="card-title text-2xl">Cart Items</h2>
                                        <button 
                                            onClick={handleClearCart}
                                            className="btn btn-ghost btn-sm text-error gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Clear Cart
                                        </button>
                                    </div>
                                    <OrderSummary />
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div 
                            className="lg:col-span-1"
                            variants={itemVariants}
                        >
                            <div className="card bg-base-100 shadow-lg sticky top-8">
                                <div className="card-body">
                                    <h2 className="card-title text-xl mb-6">Order Summary</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-base-content/80">
                                            <span>Subtotal ({getTotalItems()} items)</span>
                                            <span>${getTotalPrice().toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-base-content/80">
                                            <span>Shipping</span>
                                            <span className="text-success font-medium">Free</span>
                                        </div>
                                        
                                        <div className="flex justify-between text-base-content/80">
                                            <span>Tax</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                        
                                        <div className="divider"></div>
                                        
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="card-actions mt-6">
                                        <motion.button 
                                            onClick={handleCheckout}
                                            className="btn btn-primary btn-block btn-lg"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Proceed to Checkout
                                        </motion.button>
                                    </div>

                                    {/* Security Badge */}
                                    <div className="mt-6 text-center">
                                        <div className="text-xs text-base-content/60 flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Secure Checkout
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CartSummary;