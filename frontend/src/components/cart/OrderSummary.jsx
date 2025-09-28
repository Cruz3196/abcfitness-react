import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../storeData/cartStore';
import CartItem from './CartItem';

const OrderSummary = () => {
    const { total, totalQuantity } = useCartStore();

    const formattedTotal = total.toFixed(2);
    const totalItems = totalQuantity;


    // design of the website 

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            
        <div className="stats shadow w-full mt-6">
            <div className="stat">
                <div className="stat-title">Total Items</div>
                <div className="stat-value text-primary">{totalItems}</div>
            </div>
            <div className="stat">
                <div className="stat-title">Total Amount</div>
                <div className="stat-value text-secondary">${formattedTotal}</div>
            </div>
        </div>
        </motion.div>
    );
};

export default OrderSummary;