
import React, { useEffect, useState } from "react";
import { getMyBookings } from "../services/bookingService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyBookings()
      .then((data) => {
        setBookings(
          Array.isArray(data) ? data : data.bookings || []
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="section">
      <span className="section-label">YOUR ACTIVITY</span>
      <h2>My Bookings<span>.</span></h2>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p>You haven't made any booking requests yet.</p>
      )}

      <div className="booking-list">
        {bookings.map((booking) => (
          <div className="step-card" key={booking._id}>
            <h3>{booking.item?.title || booking.itemId?.title || "Rental Item"}</h3>
            <p>Status: {booking.status || "Pending"}</p>
            <p>Booking ID: {booking._id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Bookings;
