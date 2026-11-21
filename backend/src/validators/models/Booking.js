import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    // Item being borrowed
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    // User who borrows
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // User who lends
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Booking period
    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    // Rental calculation details
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },

    pricePerDay: {
        type: Number,
        required: true,
        min: 0
    },

    securityDeposit: {
        type: Number,
        default: 0,
        min: 0
    },

    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    // Booking lifecycle
    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "active",
            "returned",
            "completed",
            "rejected",
            "cancelled",
            "overdue"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

// Find bookings for an item and check date overlaps
bookingSchema.index({
    item: 1,
    startDate: 1,
    endDate: 1,
    status: 1
});

// Borrower dashboard
bookingSchema.index({ borrower: 1, status: 1 });

// Lender dashboard
bookingSchema.index({ lender: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;