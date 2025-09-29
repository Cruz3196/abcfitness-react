import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import useCartStore from '../storeData/cartStore';
import CartItem from '../components/cart/CartItem';
import CustomerInfo from '../components/cart/CustomerInfo';
import OrderSummary from '../components/cart/OrderSummary';

const CheckOut = () => {
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
                            {cart.length > 0 ? 'Checkout' : 'Shopping Cart'}
                        </h1>
                        {cart.length > 0 && (
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
                    
                {/* Checkout Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Left Column: Forms and Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <CustomerInfo />
                    </div>
                    
                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary />

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckOut;