import catchAsync from "../utils/catchAsync.js";
import {
    createBookingRequest,
    getUserBookings,
    updateBookingStatus
} from "../services/bookingService.js";

export const createRequest = catchAsync(async (req, res) => {
    const booking = await createBookingRequest(req.user._id, req.body);

    res.status(201).json({
        success: true,
        message: "Booking request created",
        data: { booking }
    });
});

export const listMine = catchAsync(async (req, res) => {
    const bookings = await getUserBookings(req.user._id);

    res.status(200).json({
        success: true,
        data: { bookings }
    });
});

export const approveBooking = catchAsync(async (req, res) => {
    const booking = await updateBookingStatus(req.params.id, req.user._id, "approved");

    res.status(200).json({
        success: true,
        message: "Booking approved",
        data: { booking }
    });
});

export const rejectBooking = catchAsync(async (req, res) => {
    const booking = await updateBookingStatus(req.params.id, req.user._id, "rejected");

    res.status(200).json({
        success: true,
        message: "Booking rejected",
        data: { booking }
    });
});
