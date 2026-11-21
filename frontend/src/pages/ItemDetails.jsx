
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById } from "../services/itemService";
import { createBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext.jsx";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Today's date in YYYY-MM-DD format
  const today = new Date().toLocaleDateString("en-CA");

  // Calculate rental days
  const totalDays =
    startDate && endDate
      ? Math.ceil(
          (new Date(endDate + "T00:00:00").getTime() -
            new Date(startDate + "T00:00:00").getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Fetch item details
  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setError("");

        const response = await getItemById(id);

        const itemData =
          response?.data?.item ||
          response?.item ||
          response?.data ||
          response;

        setItem(itemData);
      } catch (err) {
        setError(err.message || "Unable to load item");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  // Submit booking request
  async function handleBooking() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both rental dates.");
      return;
    }

    if (totalDays < 1) {
      setError("End date must be after start date.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      setMessage("");

      console.log("BOOKING DATA:", {
  itemId: id,
  startDate,
  endDate
});

      await createBooking({
        itemId: id,
        startDate,
        endDate
      });

      setMessage("Booking request submitted successfully!");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err.message || "Booking request failed");
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading) {
    return <div className="section">Loading item details...</div>;
  }

  if (error && !item) {
    return (
      <div className="section">
        <h2>Unable to load item</h2>
        <p className="error-message">{error}</p>
        <button
          className="primary-btn"
          onClick={() => navigate("/explore")}
        >
          Back to Explore
        </button>
      </div>
    );
  }

  if (!item) return null;

  const itemImage =
    item.images?.find((image) => typeof image === "string") ||
    (typeof item.image === "string" ? item.image : "");

  const price = item.pricePerDay ?? item.price ?? 0;
  const deposit = item.securityDeposit ?? 0;
  const owner = item.owner || {};
  const currentUserId = user?._id || user?.id;
  const ownerId = owner?._id || owner?.id || (typeof owner === "string" ? owner : null);
  const isOwner = Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId));

  return (
    <div className="section item-details-page">

      <button
        className="text-btn"
        onClick={() => navigate("/explore")}
      >
        ← Back to Explore
      </button>

      <div className="details-layout">

        {/* ITEM IMAGE */}
        <div className="details-image">
          {itemImage ? (
            <img src={itemImage} alt={item.title} />
          ) : (
            <div className="item-no-image">
              📦
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* ITEM INFORMATION */}
        <div className="details-content">

          <span className="section-label">
            {item.category || "General"}
          </span>

          <h2>{item.title}</h2>

          <h3 className="details-price">
            ₹{price} <small>/ day</small>
          </h3>

          <p className="details-description">
            {item.description || "No description available."}
          </p>

          <div className="details-information">
            <div>
              <strong>Category</strong>
              <span>{item.category || "General"}</span>
            </div>

            <div>
              <strong>Condition</strong>
              <span>{item.condition || "Not specified"}</span>
            </div>

            <div>
              <strong>Security Deposit</strong>
              <span>₹{deposit}</span>
            </div>

            <div>
              <strong>Location</strong>
              <span>{item.address || "Not specified"}</span>
            </div>

            <div>
              <strong>Owner</strong>
              <span>{owner.name || "LendX User"}</span>
            </div>
          </div>

          {/* BOOKING FORM */}
          <div className="booking-form">
            <h3>Request a Rental</h3>

            <label>Rental Start Date</label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setEndDate("");
                setError("");
                setMessage("");
              }}
            />

            <label>Rental End Date</label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              disabled={!startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setError("");
                setMessage("");
              }}
            />

            {/* PRICE CALCULATION */}
            {totalDays > 0 && (
              <div className="booking-summary">
                <div>
                  <span>Rental duration</span>
                  <strong>{totalDays} days</strong>
                </div>

                <div>
                  <span>Rental price</span>
                  <strong>₹{totalDays * price}</strong>
                </div>

                <div>
                  <span>Security deposit</span>
                  <strong>₹{deposit}</strong>
                </div>

                <div className="booking-total">
                  <span>Total including deposit</span>
                  <strong>
                    ₹{totalDays * price + deposit}
                  </strong>
                </div>
              </div>
            )}

            {isOwner && (
              <p className="error-message" style={{ background: "#eff6ff", borderColor: "#bfdbfe", color: "#1d4ed8" }}>
                You are the owner of this item.
              </p>
            )}

            <button
              className="signup-btn"
              onClick={handleBooking}
              disabled={
                bookingLoading ||
                isOwner ||
                item.isAvailable === false ||
                !startDate ||
                !endDate ||
                totalDays < 1
              }
            >
              {bookingLoading
                ? "Submitting..."
                : isOwner
                  ? "Your Item"
                  : "Request Booking"}
            </button>

            {message && (
              <p className="success-message">{message}</p>
            )}

            {error && (
              <p className="error-message">{error}</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
