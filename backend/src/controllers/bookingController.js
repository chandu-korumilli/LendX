
import catchAsync from "../utils/catchAsync.js";

import {
    createBookingRequest,
    getUserBookings,
    updateBookingStatus
} from "../services/bookingService.js";

// Create booking request
export const createRequest = catchAsync(async (req, res) => {
    const booking = await createBookingRequest(
        req.user._id,
        req.body
    );

    res.status(201).json({
        success: true,
        message: "Booking request created",
        data: { booking }
    });
});

// Get my bookings
export const listMine = catchAsync(async (req, res) => {
    const bookings = await getUserBookings(req.user._id);

    res.status(200).json({
        success: true,
        data: { bookings }
    });
});

// Approve booking
export const approveRequest = catchAsync(async (req, res) => {
    const booking = await updateBookingStatus(
        req.params.id,
        req.user._id,
        "approved"
    );

    res.status(200).json({
        success: true,
        message: "Booking approved successfully",
        data: { booking }
    });
});

// Reject booking
export const rejectRequest = catchAsync(async (req, res) => {
    const booking = await updateBookingStatus(
        req.params.id,
        req.user._id,
        "rejected"
    );

    res.status(200).json({
        success: true,
        message: "Booking rejected successfully",
        data: { booking }
    });
});
