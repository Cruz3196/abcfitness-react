import React from "react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import OrderCard from "./OrderCard";

const OrdersTab = React.memo(({ orders, isLoading }) => (
  <div>
    <div className="bg-base-200 rounded-lg">
      <div className="p-4 border-b border-base-300 flex justify-between items-center">
        <h2 className="font-semibold">Your Orders</h2>
        <span className="text-sm text-base-content/60">
          {orders.length} orders
        </span>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <span className="loading loading-spinner loading-md"></span>
          <p className="text-sm text-base-content/60 mt-2">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center">
          <Package className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
          <p className="font-medium mb-1">No orders yet</p>
          <p className="text-sm text-base-content/60 mb-4">
            When you place orders, they will appear here
          </p>
          <Link to="/store" className="btn btn-primary btn-sm">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-base-300">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  </div>
));

OrdersTab.displayName = "OrdersTab";

export default OrdersTab;
