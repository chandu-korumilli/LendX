
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyBookings,
  approveBooking,
  rejectBooking
} from "../services/bookingService";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState("");

  // Get logged-in user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");

    if (!token) return "";

    try {
      const payload = token.split(".")[1];
      const base64 = payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const decoded = JSON.parse(atob(base64));

      return String(
        decoded.id ||
        decoded._id ||
        decoded.userId ||
        decoded.sub ||
        ""
      );
    } catch (error) {
      console.error("Token reading error:", error);
      return "";
    }
  };

  const currentUserId = getCurrentUserId();

  // Load bookings
  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyBookings();

      const bookingList =
        response?.data?.bookings ||
        response?.bookings ||
        [];

      setBookings(bookingList);

    } catch (err) {
      setError(err.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    loadBookings();
  }, [navigate]);

  // Approve or reject booking
  const handleBookingAction = async (bookingId, action) => {
    try {
      setActionError("");
      setProcessingId(bookingId);

      let response;

      if (action === "approve") {
        response = await approveBooking(bookingId);
      } else {
        response = await rejectBooking(bookingId);
      }

      if (response?.success === false) {
        throw new Error(response.message || "Booking update failed");
      }

      // Update status after backend success
      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: action === "approve" ? "approved" : "rejected"
              }
            : booking
        )
      );

    } catch (err) {
      setActionError(err.message || "Unable to update booking");
    } finally {
      setProcessingId("");
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Status CSS class
  const getStatusClass = (status) => {
    return `booking-status ${status || "pending"}`;
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "pending") return booking.status === "pending";
    if (filter === "approved") return booking.status === "approved";

    if (filter === "completed") {
      return ["completed", "returned"].includes(booking.status);
    }

    return true;
  });

  if (loading) {
    return (
      <div className="section">
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  return (
    <div className="section my-bookings-page">

      {/* Header */}
      <div className="bookings-header">
        <div>
          <span className="section-label">YOUR RENTALS</span>
          <h1>My Bookings</h1>
          <p>Track your rental requests and bookings in one place.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/explore")}
        >
          Explore Items
        </button>
      </div>

      {/* Statistics */}
      <div className="booking-stats">
        <div className="booking-stat">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="booking-stat">
          <h3>
            {bookings.filter(b => b.status === "pending").length}
          </h3>
          <p>Pending</p>
        </div>

        <div className="booking-stat">
          <h3>
            {bookings.filter(b => b.status === "approved").length}
          </h3>
          <p>Approved</p>
        </div>

        <div className="booking-stat">
          <h3>
            {bookings.filter(b =>
              ["completed", "returned"].includes(b.status)
            ).length}
          </h3>
          <p>Completed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="booking-filters">
        {["all", "pending", "approved", "completed"].map((option) => (
          <button
            key={option}
            className={filter === option ? "active" : ""}
            onClick={() => setFilter(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Error messages */}
      {error && <p className="error-message">{error}</p>}

      {actionError && (
        <p className="error-message">{actionError}</p>
      )}

      {/* Empty bookings */}
      {!error && filteredBookings.length === 0 && (
        <div className="empty-bookings">
          <div className="empty-icon">📦</div>
          <h2>No bookings found</h2>
          <p>Your booking requests will appear here.</p>

          <button
            className="primary-btn"
            onClick={() => navigate("/explore")}
          >
            Browse Items
          </button>
        </div>
      )}

      {/* Booking cards */}
      <div className="bookings-list">

        {filteredBookings.map((booking) => {
          const item = booking.item || {};
          const borrower = booking.borrower || {};
          const lender = booking.lender || {};

          const borrowerId = String(
            borrower._id || borrower.id || ""
          );

          const lenderId = String(
            lender._id || lender.id || ""
          );

          // Display actual debugging values
          console.log("BOOKING CHECK:", JSON.stringify({
            currentUserId,
            lenderId,
            borrowerId,
            status: booking.status,
            bookingId: booking._id
          }, null, 2));

          const isBorrower =
            currentUserId && borrowerId === currentUserId;

          const isLender =
            currentUserId && lenderId === currentUserId;

          const image =
            item.images?.find((img) => typeof img === "string") ||
            (typeof item.image === "string" ? item.image : "");

          return (
            <div className="booking-card" key={booking._id}>

              {/* Image */}
              <div className="booking-card-image">
                {image ? (
                  <img
                    src={image}
                    alt={item.title || "Rental item"}
                  />
                ) : (
                  <span>📦</span>
                )}
              </div>

              {/* Information */}
              <div className="booking-card-content">

                <div className="booking-card-top">
                  <div>
                    <span className="section-label">
                      {item.category || "Rental"}
                    </span>

                    <h3>{item.title || "Item unavailable"}</h3>
                  </div>

                  <span className={getStatusClass(booking.status)}>
                    {booking.status || "pending"}
                  </span>
                </div>

                {/* Booking details */}
                <div className="booking-details-grid">

                  <div>
                    <small>Start Date</small>
                    <strong>{formatDate(booking.startDate)}</strong>
                  </div>

                  <div>
                    <small>End Date</small>
                    <strong>{formatDate(booking.endDate)}</strong>
                  </div>

                  <div>
                    <small>Duration</small>
                    <strong>{booking.totalDays || 0} days</strong>
                  </div>

                  <div>
                    <small>Rental Amount</small>
                    <strong>₹{booking.totalPrice || 0}</strong>
                  </div>

                </div>

                {/* User information */}
                <div className="booking-card-footer">
                  <span>
                    {isBorrower
                      ? `Owner: ${lender.name || "LendX User"}`
                      : `Requested by: ${borrower.name || "LendX User"}`}
                  </span>

                  <span>
                    {isBorrower
                      ? "You requested this item"
                      : isLender
                        ? "You own this item"
                        : "Booking information"}
                  </span>
                </div>

                {/* Approve and Reject */}
                {isLender && booking.status === "pending" && (
                  <div className="booking-actions">

                    <button
                      className="booking-approve-btn"
                      disabled={processingId === booking._id}
                      onClick={() =>
                        handleBookingAction(booking._id, "approve")
                      }
                    >
                      {processingId === booking._id
                        ? "Please wait..."
                        : "Approve"}
                    </button>

                    <button
                      className="booking-reject-btn"
                      disabled={processingId === booking._id}
                      onClick={() =>
                        handleBookingAction(booking._id, "reject")
                      }
                    >
                      {processingId === booking._id
                        ? "Please wait..."
                        : "Reject"}
                    </button>

                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default MyBookings;
