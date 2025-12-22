import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Users,
  CreditCard,
  Loader2,
  User,
  CheckCircle,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import Spinner from "../components/common/Spinner";
import Breadcrumbs from "../components/common/Breadcrumbs";
import { classStore } from "../storeData/classStore";
import { userStore } from "../storeData/userStore";
import { reviewStore } from "../storeData/reviewStore";
import axios from "../api/axios";
import toast from "react-hot-toast";
import BookingCard from "../components/user/BookingCard";

const stripePromise = loadStripe(
  "pk_test_51S9WGyIEpMTZmgDrULbvg0KMshtzSdkQmHiojffBNMBXnxcO6XPk4TkVrramUD783saSb1y5LLmEnRUifA8B7nUm00VYLvV1Ag"
);

const ClassDetail = () => {
  const { id } = useParams();
  const { user, fetchMyBookings } = userStore();
  const [latestBooking, setLatestBooking] = useState(null);
  const [bookedSessions, setBookedSessions] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    selectedClass,
    availableSessions,
    isLoading,
    isBooking,
    error,
    fetchClassById,
    bookClass,
  } = classStore();

  const {
    reviews,
    isLoading: reviewsLoading,
    isSubmitting,
    fetchReviewsByClass,
    submitReview,
    updateReview,
    deleteReview,
    clearReviews,
  } = reviewStore();

  useEffect(() => {
    if (id) {
      console.log("Fetching class with ID:", id);
      fetchClassById(id);
    }
  }, [id, fetchClassById]);

  // Fetch reviews when class is loaded
  useEffect(() => {
    if (id && selectedClass) {
      fetchReviewsByClass(id);
    }

    return () => {
      clearReviews();
    };
  }, [id, selectedClass, fetchReviewsByClass, clearReviews]);

  // Handle review submission
  const handleReviewSubmit = async (reviewData) => {
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }
    return await submitReview(id, reviewData);
  };

  const handleReviewUpdate = async (reviewId, updateData) => {
    return await updateReview(reviewId, updateData);
  };

  const handleReviewDelete = async (reviewId) => {
    return await deleteReview(reviewId);
  };

  // Sync booked sessions from user bookings (no localStorage needed)
  useEffect(() => {
    if (user && selectedClass && user.bookings) {
      const userBookedDatesForThisClass = new Set(
        user.bookings
          .filter(
            (booking) =>
              booking.class?._id === selectedClass._id &&
              booking.status !== "cancelled" &&
              booking.paymentStatus === "paid"
          )
          .map(
            (booking) =>
              new Date(booking.sessionDate).toISOString().split("T")[0]
          )
      );

      setBookedSessions(userBookedDatesForThisClass);
    }
  }, [user?.bookings, selectedClass]);

  // Handle booking with Stripe
  const handleBookClass = async (session) => {
    if (!user) {
      toast.error("Please log in to book a class");
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Creating checkout session for:", {
        classId: id,
        sessionDate: session.date,
      });

      const response = await axios.post("/payment/createClassCheckoutSession", {
        classId: id,
        sessionDate: session.date,
      });

      const sessionData = response.data;

      const stripe = await stripePromise;
      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.id,
      });

      if (result.error) {
        console.error("Stripe error:", result.error);
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to determine button state
  const getButtonState = (session) => {
    const sessionDateString = session.date;
    const isBooked = bookedSessions.has(sessionDateString);
    const isFull = session.spotsLeft <= 0;
    const isPast = new Date(session.date) < new Date();

    if (isPast) {
      return {
        text: "Past Session",
        disabled: true,
        className: "btn btn-disabled",
      };
    } else if (isBooked) {
      return {
        text: "Already Booked",
        disabled: true,
        className: "btn btn-success",
      };
    } else if (isFull) {
      return {
        text: "Class Full",
        disabled: true,
        className: "btn btn-error",
      };
    } else if (isProcessing) {
      return {
        text: (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ),
        disabled: true,
        className: "btn btn-primary",
      };
    } else {
      return {
        text: (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Reserve Spot - ${selectedClass.price}
          </>
        ),
        disabled: false,
        className: "btn btn-primary",
      };
    }
  };

  // Show loading while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
        <Spinner />
      </div>
    );
  }

  // Show error or not found
  if (error || !selectedClass) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-medium mb-4">
          {error || "Class Not Found"}
        </h2>
        <Link to="/classes" className="btn btn-primary btn-sm">
          Back to Classes
        </Link>
      </div>
    );
  }

  const breadcrumbPaths = [
    { name: "Home", link: "/" },
    { name: "Classes", link: "/classes" },
    { name: selectedClass.classTitle, link: `/classes/${id}` },
  ];

  const trainerName =
    selectedClass.trainer?.user?.username || "Unknown Trainer";
  const trainerId = selectedClass.trainer?._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Breadcrumbs paths={breadcrumbPaths} />
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Class Image */}
        <div className="rounded-lg overflow-hidden border border-base-300">
          <img
            src={
              selectedClass.classPic ||
              "https://placehold.co/600x400?text=Class"
            }
            alt={selectedClass.classTitle}
            className="w-full h-auto max-h-[400px] object-cover"
          />
        </div>

        {/* Class Info */}
        <div>
          <p className="text-sm text-base-content/60 uppercase tracking-wide mb-1">
            {selectedClass.classType}
          </p>

          <h1 className="text-2xl font-medium mb-2">
            {selectedClass.classTitle}
          </h1>

          <div className="flex items-center gap-2 text-sm text-base-content/70 mb-4">
            <User className="w-4 h-4" />
            {trainerId ? (
              <Link
                to={`/trainers/${trainerId}`}
                className="text-primary hover:underline"
              >
                {trainerName}
              </Link>
            ) : (
              <span>{trainerName}</span>
            )}
          </div>

          <p className="text-base-content/70 mb-6 leading-relaxed">
            {selectedClass.classDescription}
          </p>

          <div className="border-t border-base-300 pt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {selectedClass.timeSlot?.day}s at{" "}
                {selectedClass.timeSlot?.startTime}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>{selectedClass.duration} minutes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span>{selectedClass.capacity} spots per session</span>
            </div>
          </div>

          <div className="border-t border-base-300 mt-4 pt-4">
            <span className="text-2xl font-bold">${selectedClass.price}</span>
            <span className="text-base-content/60 text-sm ml-1">
              per session
            </span>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="border-t border-base-300 pt-8">
        <h2 className="text-xl font-medium mb-4">Available Sessions</h2>

        {!user && (
          <div className="alert alert-warning mb-4 text-sm">
            <span>Please log in to book a class</span>
          </div>
        )}

        {availableSessions.length > 0 ? (
          <div className="space-y-3">
            {availableSessions.map((session) => {
              const buttonState = getButtonState(session);
              const spotsLeft = session.spotsLeft;

              return (
                <div
                  key={session.date}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-base-300 rounded-lg hover:border-primary/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-base-content/60">
                      {session.startTime} - {session.endTime} · {spotsLeft} spot
                      {spotsLeft !== 1 ? "s" : ""} left
                    </p>
                  </div>

                  <button
                    className={`${buttonState.className} btn-sm`}
                    onClick={() => handleBookClass(session)}
                    disabled={buttonState.disabled || !user}
                  >
                    {buttonState.text}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-base-content/50">
            No upcoming sessions available for this class.
          </p>
        )}

        <p className="text-xs text-base-content/50 text-center mt-6">
          Secure payment powered by Stripe · Full refund if cancelled 24h before
          class
        </p>
      </div>

      {/* Booking Confirmation Modal */}
      {latestBooking && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-6 h-6 text-success" />
              <h3 className="font-bold text-xl">Booking Confirmed!</h3>
            </div>
            <p className="text-base-content/70 mb-4">
              You're all set. Here are your class details:
            </p>

            <BookingCard booking={latestBooking} isHistory={false} />

            <div className="modal-action">
              <Link to="/profile" className="btn btn-outline btn-sm">
                My Profile
              </Link>
              <button
                onClick={() => setLatestBooking(null)}
                className="btn btn-primary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetail;
