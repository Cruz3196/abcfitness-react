import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import useCartStore from '../storeData/cartStore';
import CartItem from '../components/cart/CartItem';
import OrderSummary from '../components/cart/OrderSummary';

const CartSummary = () => {
    const { cart } = useCartStore();

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="min-h-screen bg-base-200 py-4 sm:py-6 md:py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <motion.div 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 bg-base-100 p-4 sm:p-5 md:p-6 rounded-lg shadow-lg gap-3 sm:gap-4"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0" />
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content">
                            {cart.length > 0 ? 'In the bag' : 'Shopping Cart'}
                        </h1>
                        {cart.length > 0 && (
                            <div className="badge badge-primary badge-md sm:badge-lg">
                                {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                            </div>
                        )}
                    </div>
                    <Link 
                        to="/store" 
                        className="btn btn-outline btn-primary gap-2 btn-sm sm:btn-md w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden xs:inline">Continue Shopping</span>
                        <span className="xs:hidden">Shop More</span>
                    </Link>
                </motion.div>

                {cart.length === 0 ? (
                    <motion.div className="text-center py-8 sm:py-12 md:py-16" variants={itemVariants}>
                        <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
                            <div className="card-body items-center text-center p-6 sm:p-8">
                                <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-base-300 mb-3 sm:mb-4" />
                                <h2 className="card-title text-xl sm:text-2xl mb-3 sm:mb-4">Your cart is empty</h2>
                                <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">
                                    Looks like you haven't added anything yet.
                                </p>
                                <Link to="/store" className="btn btn-primary btn-wide w-full sm:w-auto">
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-start">
                        {/* Left Column: Cart Items */}
                        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                            <motion.div 
                                className="card bg-base-100 shadow-xl"
                                variants={itemVariants}
                            >
                                <div className="card-body p-4 sm:p-5 md:p-6">
                                    <h2 className="card-title text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4">Review Your Items</h2>
                                    <div className="space-y-3 sm:space-y-4">
                                        {cart.map((item) => (
                                            <CartItem key={item._id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                        {/* Right Column: Order Summary - Sticky on desktop, normal on mobile */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-4">
                                <OrderSummary />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CartSummary;