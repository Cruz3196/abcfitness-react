import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Calendar,
  CreditCard,
  CheckCircle,
  Copy,
} from "lucide-react";
import { useOrderStore } from "../storeData/useOrderStore";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, fetchOrderById } = useOrderStore();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cachedOrder = getOrderById(orderId);
        if (cachedOrder) {
          setOrder(cachedOrder);
          setIsLoading(false);
          return;
        }

        const fetchedOrder = await fetchOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        setError(error.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetails();
    }
  }, [orderId, getOrderById, fetchOrderById]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(order._id);
    toast.success("Order ID copied!");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: "badge-success",
      delivered: "badge-success",
      processing: "badge-warning",
      pending: "badge-info",
      cancelled: "badge-error",
    };
    return statusMap[status?.toLowerCase()] || "badge-success";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
          <h1 className="text-xl font-semibold mb-2">Order Not Found</h1>
          <p className="text-base-content/60 mb-4 text-sm">
            {error || "This order doesn't exist."}
          </p>
          <Link to="/store" className="btn btn-primary btn-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-base-200 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Order Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-base-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold">
                    Order #{order._id.slice(-8)}
                  </h1>
                  <button
                    onClick={copyOrderId}
                    className="btn btn-ghost btn-xs"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-base-content/60">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className={`badge ${getStatusBadge(order.status)} gap-1`}>
                  <CheckCircle className="w-3 h-3" />
                  {order.status || "Completed"}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="py-4">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items ({order.items?.length || 0})
              </h2>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-base-200 rounded-lg"
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.name || "Product"}
                      </p>
                      <p className="text-sm text-base-content/60">
                        Qty: {item.quantity || 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="pt-4 border-t border-base-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-base-content/60">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Paid via Stripe</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-base-content/60">Total</span>
                  <p className="text-xl font-bold text-primary">
                    ${order.totalAmount?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-4">
              <Link to="/store" className="btn btn-primary btn-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailsPage;
