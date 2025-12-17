import React from "react";
import { Link } from "react-router-dom";

const OrderCard = React.memo(({ order }) => (
  <div className="p-4 hover:bg-base-300/50 transition-colors">
    <div className="flex gap-4">
      {/* Order Image */}
      <div className="flex-shrink-0">
        {order.items?.[0]?.image ? (
          <img
            src={order.items[0].image}
            alt="Order"
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-base-300 rounded flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-base-content/60">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">
              ${order.totalAmount?.toFixed(2) || "0.00"}
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                order.status === "completed" || !order.status
                  ? "bg-success/20 text-success"
                  : "bg-warning/20 text-warning"
              }`}
            >
              {order.status || "Completed"}
            </span>
          </div>
        </div>

        <p className="text-sm text-base-content/60 mt-1">
          {order.items?.length || order.itemCount || 0} item(s)
        </p>

        <div className="flex gap-3 mt-2">
          <Link
            to={`/order/${order._id}`}
            className="text-sm text-primary hover:underline"
          >
            View order details
          </Link>
          <Link to="/store" className="text-sm text-primary hover:underline">
            Buy again
          </Link>
        </div>
      </div>
    </div>
  </div>
));

OrderCard.displayName = "OrderCard";

export default OrderCard;
