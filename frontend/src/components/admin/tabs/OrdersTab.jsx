import React from "react";
import { motion } from "framer-motion";
import { Package, Eye, DollarSign } from "lucide-react";
import { adminStore } from "../../../storeData/adminStore";

const OrdersTab = () => {
  const { orders, isLoading: isLoadingAdmin, fetchAllOrders } = adminStore();

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getOrderId = (id) => {
    return `#${id.slice(-8).toUpperCase()}`;
  };

  return (
    <motion.div className="card bg-base-100 shadow-lg" variants={itemVariants}>
      <div className="card-body p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="card-title text-lg sm:text-xl">
            <Package className="w-5 h-5" />
            Order Management
          </h2>
          <div className="flex gap-2">
            <div className="badge badge-primary badge-lg">
              {orders.length} Orders
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={fetchAllOrders}
              disabled={isLoadingAdmin}
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoadingAdmin ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="mx-auto w-16 h-16 text-base-300 mb-2" />
            <p className="text-base-content/70">No orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="font-mono font-bold text-primary">
                          {getOrderId(order._id)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-10">
                              <span className="text-sm">
                                {order.user?.username
                                  ?.charAt(0)
                                  ?.toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {order.user?.username || "Unknown"}
                            </div>
                            <div className="text-sm opacity-50">
                              {order.user?.email || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          {order.products?.slice(0, 2).map((item, index) => (
                            <span key={index} className="text-sm">
                              {item.product?.productName || "Unknown"} x
                              {item.quantity}
                            </span>
                          ))}
                          {order.products?.length > 2 && (
                            <span className="text-xs text-base-content/50">
                              +{order.products.length - 2} more items
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-success">
                          ${order.totalAmount?.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-sm">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-primary">
                          {getOrderId(order._id)}
                        </span>
                        <p className="text-sm text-base-content/70 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <span className="font-bold text-success text-lg">
                        ${order.totalAmount?.toFixed(2)}
                      </span>
                    </div>

                    <div className="divider my-2"></div>

                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span className="text-xs">
                            {order.user?.username?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {order.user?.username || "Unknown"}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium mb-1">Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {order.products?.map((item, index) => (
                          <span key={index} className="badge badge-sm">
                            {item.product?.productName || "Unknown"} x
                            {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 flex justify-end">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-figure text-success">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Total Revenue</div>
                  <div className="stat-value text-success">
                    $
                    {orders
                      .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
                      .toFixed(2)}
                  </div>
                  <div className="stat-desc">{orders.length} orders</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export { OrdersTab };
