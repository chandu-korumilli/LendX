import Booking from "../validators/models/Booking.js";
import Item from "../validators/models/Item.js";

const reservingStatuses = ["pending", "approved", "active", "overdue"];
const millisecondsPerDay = 24 * 60 * 60 * 1000;

const createHttpError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const createBookingRequest = async (borrowerId, {
    itemId,
    startDate,
    endDate
}) => {
    const item = await Item.findById(itemId);

    if (!item || item.status === "removed") {
        throw createHttpError(404, "Item not found");
    }

    if (item.status !== "active" || !item.isAvailable) {
        throw createHttpError(409, "Item is not available for booking");
    }

    if (item.owner.equals(borrowerId)) {
        throw createHttpError(400, "You cannot book your own item");
    }

    const bookingStart = new Date(startDate);
    const bookingEnd = new Date(endDate);
    const totalDays = Math.ceil(
        (bookingEnd.getTime() - bookingStart.getTime()) / millisecondsPerDay
    );

    const overlappingBooking = await Booking.exists({
        item: item._id,
        status: { $in: reservingStatuses },
        startDate: { $lt: bookingEnd },
        endDate: { $gt: bookingStart }
    });

    if (overlappingBooking) {
        throw createHttpError(409, "The item already has a booking during those dates");
    }

    const booking = await Booking.create({
        item: item._id,
        borrower: borrowerId,
        lender: item.owner,
        startDate: bookingStart,
        endDate: bookingEnd,
        totalDays,
        pricePerDay: item.pricePerDay,
        securityDeposit: item.securityDeposit,
        totalPrice: totalDays * item.pricePerDay,
        status: "pending"
    });

    return booking.populate([
        { path: "item", select: "title category images pricePerDay securityDeposit" },
        { path: "borrower", select: "name" },
        { path: "lender", select: "name" }
    ]);
};

export const getUserBookings = async (userId) => Booking.find({
    $or: [{ borrower: userId }, { lender: userId }]
})
    .populate("item", "title category images pricePerDay securityDeposit")
    .populate("borrower", "name")
    .populate("lender", "name")
    .sort({ createdAt: -1 });
