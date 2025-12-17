import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { userStore } from "../../../storeData/userStore";
import BookingCard from "../BookingCard";

const BookingSection = React.memo(
  ({
    title,
    icon: Icon,
    bookings,
    isHistory,
    emptyMessage,
    emptySubMessage,
    linkTo,
    linkText,
  }) => {
    const { fetchMyBookings } = userStore();

    const handleBookingUpdate = useCallback(async () => {
      console.log("Refreshing bookings after update...");
      await fetchMyBookings(true);
    }, [fetchMyBookings]);

    if (bookings.length === 0) {
      return (
        <div className="p-8 text-center">
          <Icon className="w-12 h-12 mx-auto text-base-content/30 mb-3" />
          <p className="font-medium mb-1">{emptyMessage}</p>
          {emptySubMessage && (
            <p className="text-sm text-base-content/60 mb-4">
              {emptySubMessage}
            </p>
          )}
          {linkTo && linkText && (
            <Link to={linkTo} className="btn btn-primary btn-sm">
              {linkText}
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className="divide-y divide-base-300">
        {bookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            isHistory={isHistory}
            onBookingUpdate={handleBookingUpdate}
          />
        ))}
      </div>
    );
  }
);

BookingSection.displayName = "BookingSection";

export default BookingSection;
