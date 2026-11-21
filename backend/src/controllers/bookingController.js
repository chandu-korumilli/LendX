import catchAsync from "../utils/catchAsync.js";
import {
    createBookingRequest,
    getUserBookings
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
