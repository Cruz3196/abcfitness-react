import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../storeData/cartStore';
import CartItem from './CartItem';

const OrderSummary = () => {
    const { cartItems, getTotalItems, getTotalPrice } = useCartStore();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-base-content/70">Your cart is empty</p>
            </div>
        );
    }

    return (
        <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AnimatePresence>
                {cartItems.map(item => (
                    <CartItem key={item.id} item={item} />
                ))}
            </AnimatePresence>
            
            <div className="stats shadow w-full mt-6">
                <div className="stat">
                    <div className="stat-title">Total Items</div>
                    <div className="stat-value text-primary">{getTotalItems()}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Amount</div>
                    <div className="stat-value text-secondary">${getTotalPrice().toFixed(2)}</div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;