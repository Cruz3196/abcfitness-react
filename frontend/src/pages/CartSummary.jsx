import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrderSummary from '../components/cart/OrderSummary';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import useCartStore from '../storeData/cartStore';
import CartItem from '../components/cart/CartItem';
import FeaturedProducts from '../components/products/FeaturedProducts';

const CartSummary = () => {
    const { cart } = useCartStore();

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const handleCheckout = () => {
        console.log('Proceeding to checkout...');
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

                {/* Cart Content */}
                <motion.div 
                        className="text-center py-16"
                        variants={itemVariants}
                >
                    {cart.length === 0 ? (
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
                    ) : (
                        <div className ="mb-8 text-center">
                            {cart.map((item) => (
                                <CartItem key={item._id} item={item} />
                            ))}
                        </div>
                    )}
                    {/* if the user has more than 0 items in the cart show recommended products */}
                    {/* {cart.length > 0 && <FeaturedProducts/>} */}
                </motion.div>

                {cart.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <motion.div 
                            className="lg:col-span-2"
                            variants={itemVariants}
                        >
                            <OrderSummary/>
                        </motion.div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CartSummary;