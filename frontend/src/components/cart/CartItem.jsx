import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import useCartStore from '../../storeData/cartStore';
import { useState } from 'react';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCartStore();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity >= 0 && !isUpdating) {
            setIsUpdating(true);
            try {
                await updateQuantity(item._id, newQuantity);
            } catch (error) {
                console.error('Error updating quantity:', error);
            } finally {
                setIsUpdating(false);
            }
        }
    }

    const handleRemove = async () => {
        if (!isUpdating) {
            setIsUpdating(true);
            try {
                await removeFromCart(item._id);
            } catch (error) {
                console.error('Error removing item:', error);
            } finally {
                setIsUpdating(false);
            }
        }
    }

    const itemPrice = Number(item.productPrice) || Number(item.price) || 0;
    const itemQuantity = Number(item.quantity) || 1;
    const itemName = item.productName || item.name || 'Unknown Product';
    const itemCategory = item.productCategory || item.category || 'Uncategorized';
    const itemImage = item.productImage || item.image || item.imageUrl || "https://via.placeholder.com/80x80?text=No+Image";

    return (
        <motion.div 
            className="card bg-base-100 shadow-sm border border-base-300 mb-3 sm:mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-body p-3 sm:p-4">
                {/* Mobile Layout */}
                <div className="flex md:hidden gap-3">
                    {/* Product Image */}
                    <div className="avatar flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg">
                            <img 
                                src={itemImage} 
                                alt={itemName}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                }}
                            />
                        </div>
                    </div>

                    {/* Product Info and Controls */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        {/* Top: Name, Category, Price */}
                        <div>
                            <h3 className="font-semibold text-base sm:text-lg text-base-content truncate">
                                {itemName}
                            </h3>
                            <div className="badge badge-outline badge-xs sm:badge-sm mt-1">
                                {itemCategory}
                            </div>
                            <p className="text-primary font-bold mt-1 sm:mt-2 text-sm sm:text-base">
                                ${itemPrice.toFixed(2)}
                            </p>
                        </div>

                        {/* Bottom: Quantity, Subtotal, Remove */}
                        <div className="flex items-center justify-between mt-2 gap-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-base-content/70">Qty:</span>
                                <div className="join">
                                    <button 
                                        className={`btn btn-xs join-item ${isUpdating ? 'loading' : ''}`}
                                        onClick={() => handleQuantityChange(itemQuantity - 1)}
                                        disabled={itemQuantity <= 1 || isUpdating}
                                    >
                                        {!isUpdating && <Minus className="w-3 h-3" />}
                                    </button>
                                    <span className="btn btn-xs join-item no-animation cursor-default min-w-[2rem]">
                                        {itemQuantity}
                                    </span>
                                    <button 
                                        className={`btn btn-xs join-item ${isUpdating ? 'loading' : ''}`}
                                        onClick={() => handleQuantityChange(itemQuantity + 1)}
                                        disabled={isUpdating}
                                    >
                                        {!isUpdating && <Plus className="w-3 h-3" />}
                                    </button>
                                </div>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right">
                                <div className="text-xs text-base-content/70">Total</div>
                                <div className="font-bold text-sm sm:text-base">
                                    ${(itemPrice * itemQuantity).toFixed(2)}
                                </div>
                            </div>

                            {/* Remove Button */}
                            <motion.button 
                                onClick={handleRemove}
                                className={`btn btn-ghost btn-xs sm:btn-sm text-error ${isUpdating ? 'loading' : ''}`}
                                disabled={isUpdating}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {!isUpdating && <Trash2 className="w-4 h-4" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex gap-4">
                    {/* Product Image */}
                    <div className="avatar">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-lg">
                            <img 
                                src={itemImage} 
                                alt={itemName}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                                }}
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-base-content">
                            {itemName}
                        </h3>
                        <div className="badge badge-outline badge-sm mt-1">
                            {itemCategory}
                        </div>
                        <p className="text-primary font-bold mt-2">
                            ${itemPrice.toFixed(2)}
                        </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-base-content/70">Quantity</span>
                        <div className="join">
                            <button 
                                className={`btn btn-xs join-item ${isUpdating ? 'loading' : ''}`}
                                onClick={() => handleQuantityChange(itemQuantity - 1)}
                                disabled={itemQuantity <= 1 || isUpdating}
                            >
                                {!isUpdating && <Minus className="w-3 h-3" />}
                            </button>
                            <span className="btn btn-xs join-item no-animation cursor-default min-w-[2.5rem]">
                                {itemQuantity}
                            </span>
                            <button 
                                className={`btn btn-xs join-item ${isUpdating ? 'loading' : ''}`}
                                onClick={() => handleQuantityChange(itemQuantity + 1)}
                                disabled={isUpdating}
                            >
                                {!isUpdating && <Plus className="w-3 h-3" />}
                            </button>
                        </div>
                    </div>

                    {/* Subtotal and Remove */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                            <div className="text-sm text-base-content/70">Subtotal</div>
                            <div className="font-bold text-lg">
                                ${(itemPrice * itemQuantity).toFixed(2)}
                            </div>
                        </div>
                        <motion.button 
                            onClick={handleRemove}
                            className={`btn btn-ghost btn-sm text-error ${isUpdating ? 'loading' : ''}`}
                            disabled={isUpdating}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {!isUpdating && <Trash2 className="w-4 h-4" />}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;