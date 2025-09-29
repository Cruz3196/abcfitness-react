import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCartStore from '../../storeData/cartStore';

const OrderSummary = () => {
    const { total } = useCartStore();

    // Example values for shipping and tax
    const shippingCost = total > 50 ? 0 : 5.99;
    const taxRate = 0.08; // 8%
    const taxAmount = total * taxRate;
    const finalTotal = total + shippingCost + taxAmount;

    const handlePlaceOrder = () => {
        // Here you would handle form validation and submission
        console.log('Order placed!', {
            subtotal: total.toFixed(2),
            shipping: shippingCost.toFixed(2),
            tax: taxAmount.toFixed(2),
            total: finalTotal.toFixed(2),
        });
        // Example: alert('Thank you for your order!');
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="card bg-base-100 shadow-xl" 
            variants={itemVariants}
        >
            <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Order Summary</h2>
                <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (8%)</span>
                        <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">${finalTotal.toFixed(2)}</span>
                    </div>
                </div>
                <div className="card-actions mt-6">
                    <Link
                        className="btn btn-primary btn-block"
                        onClick={handlePlaceOrder}
                        to="/checkout"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderSummary;