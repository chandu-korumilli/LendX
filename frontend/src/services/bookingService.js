
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  };
}

// Create booking request
export async function createBooking(bookingData) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(bookingData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Booking request failed");
  }

  return data;
}

// Get my bookings
export async function getMyBookings() {
  const response = await fetch(`${API_URL}/bookings`, {
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch bookings");
  }

  return data;
}

// Approve booking
export async function approveBooking(bookingId) {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/approve`,
    {
      method: "PATCH",
      headers: getHeaders()
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to approve booking");
  }

  return data;
}

// Reject booking
export async function rejectBooking(bookingId) {
  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/reject`,
    {
      method: "PATCH",
      headers: getHeaders()
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to reject booking");
  }

  return data;
}
