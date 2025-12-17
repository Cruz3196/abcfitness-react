import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import BookingSection from "./BookingSection";

const BookingsTab = React.memo(({ upcomingBookings, isLoading }) => (
  <div className="bg-base-200 rounded-lg">
    <div className="p-4 border-b border-base-300 flex justify-between items-center">
      <h2 className="font-semibold">Your Class Bookings</h2>
      <span className="text-sm text-base-content/60">
        {upcomingBookings.length} upcoming
      </span>
    </div>

    {isLoading ? (
      <div className="p-8 text-center">
        <span className="loading loading-spinner loading-md"></span>
        <p className="text-sm text-base-content/60 mt-2">Loading bookings...</p>
      </div>
    ) : upcomingBookings.length === 0 ? (
      <div className="p-8 text-center">
        <Calendar className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
        <p className="font-medium mb-1">No classes booked</p>
        <p className="text-sm text-base-content/60 mb-4">
          Book a class to start your fitness journey
        </p>
        <Link to="/classes" className="btn btn-primary btn-sm">
          Browse Classes
        </Link>
      </div>
    ) : (
      <BookingSection
        title="Upcoming Classes"
        icon={Calendar}
        bookings={upcomingBookings}
        isHistory={false}
        emptyMessage="No upcoming bookings"
        emptySubMessage="Ready to start your fitness journey?"
        linkTo="/classes"
        linkText="Browse Classes"
      />
    )}
  </div>
));

BookingsTab.displayName = "BookingsTab";

export default BookingsTab;
