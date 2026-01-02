import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Package } from "lucide-react";
import useCartStore from "../storeData/cartStore";
import CartItem from "../components/cart/CartItem";
import OrderSummary from "../components/cart/OrderSummary";
import Spinner from "../components/common/Spinner";

const CartSummary = () => {
  const { cart, isLoading } = useCartStore();

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-base-200 py-4 sm:py-6 md:py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
        {/* Simplified Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 bg-base-100 p-4 sm:p-5 rounded-lg shadow-sm gap-3"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Shopping Cart
            </h1>
          </div>
          <Link to="/store" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            className="text-center py-8 sm:py-12 md:py-16"
            variants={itemVariants}
          >
            <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
              <div className="card-body items-center text-center p-6 sm:p-8">
                <Package className="w-16 h-16 sm:w-20 sm:h-20 text-base-300 mb-3 sm:mb-4" />
                <h2 className="card-title text-xl sm:text-2xl mb-2">
                  Your cart is empty
                </h2>
                <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">
                  Discover amazing products in our store
                </p>
                <Link to="/store" className="btn btn-primary w-full">
                  Start Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {/* Right Column: Order Summary - Show first on mobile for quick checkout */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="lg:sticky lg:top-4">
                <OrderSummary />
              </div>
            </div>

            {/* Left Column: Cart Items */}
            <div className="lg:col-span-2 order-last lg:order-first">
              <motion.div
                className="card bg-base-100 shadow-sm"
                variants={itemVariants}
              >
                <div className="card-body p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-base-content/70">
                      {getTotalItems()}{" "}
                      {getTotalItems() === 1 ? "item" : "items"}
                    </h2>
                    <span className="text-sm text-base-content/50">Price</span>
                  </div>
                  <div className="divider my-0"></div>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <CartItem key={item._id} item={item} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartSummary;
