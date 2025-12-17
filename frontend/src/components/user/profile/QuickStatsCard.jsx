import React from "react";
import { Package, Calendar, Clock } from "lucide-react";

const QuickStatsCard = React.memo(
  ({ totalBookings, totalOrders, isLoadingOrders, memberSince }) => (
    <div className="bg-base-200 rounded-lg">
      <div className="p-4 border-b border-base-300">
        <h2 className="font-semibold">Account Activity</h2>
      </div>
      <div className="grid grid-cols-3 divide-x divide-base-300">
        <div className="p-4 text-center">
          <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">
            {isLoadingOrders ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              totalOrders
            )}
          </p>
          <p className="text-xs text-base-content/60">Orders</p>
        </div>
        <div className="p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-secondary" />
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-xs text-base-content/60">Bookings</p>
        </div>
        <div className="p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold">
            {memberSince ? new Date(memberSince).getFullYear() : "2024"}
          </p>
          <p className="text-xs text-base-content/60">Member Since</p>
        </div>
      </div>
    </div>
  )
);

QuickStatsCard.displayName = "QuickStatsCard";

export default QuickStatsCard;
