import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '../../storeData/cartStore';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCartStore();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(item.id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeFromCart(item.id);
    };

    return (
        <motion.div 
            className="card bg-base-100 shadow-sm border border-base-300 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-body p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <div className="avatar">
                        <div className="w-20 h-20 rounded-lg">
                            <img 
                                src={item.image || "/api/placeholder/80/80"} 
                                alt={item.name}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-base-content">
                            {item.name}
                        </h3>
                        <div className="badge badge-outline badge-sm mt-1">
                            {item.category}
                        </div>
                        <p className="text-primary font-bold mt-2">
                            ${item.price.toFixed(2)}
                        </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-base-content/70">Quantity</span>
                        <div className="join">
                            <button 
                                className="btn btn-xs join-item"
                                onClick={() => handleQuantityChange(item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="btn btn-xs join-item no-animation cursor-default">
                                {item.quantity}
                            </span>
                            <button 
                                className="btn btn-xs join-item"
                                onClick={() => handleQuantityChange(item.quantity + 1)}
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <div className="text-sm text-base-content/70">Subtotal</div>
                            <div className="font-bold text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                        <motion.button 
                            onClick={handleRemove}
                            className="btn btn-ghost btn-sm text-error"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;