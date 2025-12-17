import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Loader2,
  ShieldCheck,
  Truck,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import useCartStore from "../../storeData/cartStore";
import { userStore } from "../../storeData/userStore";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { cart, subtotal } = useCartStore();
  const { user, checkAuthStatus } = userStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (!user) {
      checkAuthStatus();
    }
  }, [user, checkAuthStatus]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to complete your purchase");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post("/payment/createCheckoutSession", {
        products: cart.map((item) => ({
          _id: item._id,
          productName: item.productName,
          productPrice: item.productPrice || item.price,
          quantity: item.quantity,
          img: item.productImage || item.img,
        })),
      });

      const session = response.data;

      if (session.url) {
        window.location.href = session.url;
      } else {
        toast.error("No checkout URL received");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again in a moment.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to process checkout"
        );
      }

      setIsProcessing(false);
    }
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);
  const taxes = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const finalTotal = subtotal + taxes + shipping;

  return (
    <motion.div
      className="card bg-base-100 shadow-xl sticky top-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="card-body p-4 sm:p-6">
        {/* Express Checkout Button - Amazon Style */}
        {user ? (
          <button
            className="btn btn-warning btn-lg w-full mb-4 text-warning-content font-bold shadow-md hover:shadow-lg transition-all"
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Buy Now (${getTotalItems()} ${
                getTotalItems() === 1 ? "item" : "items"
              })`
            )}
          </button>
        ) : (
          <Link to="/login" className="btn btn-warning btn-lg w-full mb-4">
            Sign in to checkout
          </Link>
        )}

        {/* Order Total - Prominent Display */}
        <div className="bg-base-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Order Total:</span>
            <span className="text-xl text-primary">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
          {shipping === 0 && (
            <p className="text-success text-sm mt-1 flex items-center gap-1">
              <Truck className="w-4 h-4" />
              FREE Shipping on orders over $50!
            </p>
          )}
        </div>

        {/* Collapsible Order Details */}
        <button
          className="btn btn-ghost btn-sm w-full justify-between mb-2"
          onClick={() => setShowItems(!showItems)}
        >
          <span className="text-sm">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in cart
          </span>
          {showItems ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Items List - Collapsible */}
        {showItems && (
          <motion.div
            className="space-y-3 mb-4 max-h-60 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-2 bg-base-200 rounded-lg"
              >
                <img
                  src={item.productImage || item.img}
                  alt={item.productName}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-base-content/60">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm">
                  $
                  {((item.productPrice || item.price) * item.quantity).toFixed(
                    2
                  )}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Price Breakdown - Compact */}
        <div className="space-y-1 text-sm border-t border-base-300 pt-3">
          <div className="flex justify-between text-base-content/70">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base-content/70">
            <span>Tax (8%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base-content/70">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-success font-medium" : ""}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="divider my-3"></div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-base-content/60">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-info" />
            <span>Stripe protected</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-warning" />
            <span>Fast delivery</span>
          </div>
        </div>

        {/* Secondary Checkout Option */}
        {user && (
          <button
            className="btn btn-outline btn-sm w-full mt-4"
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
          >
            <CreditCard className="w-4 h-4" />
            Checkout with Stripe
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default OrderSummary;
