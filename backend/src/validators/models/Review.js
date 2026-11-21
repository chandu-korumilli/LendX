import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

    // Booking associated with review
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },

    // User who writes the review
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // User receiving the review
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Item being reviewed
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    // Rating from 1 to 5
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    // Review comment
    comment: {
        type: String,
        trim: true,
        maxlength: 1000,
        default: ""
    }

}, {
    timestamps: true
});

// One review per user per booking
reviewSchema.index(
    { booking: 1, reviewer: 1 },
    { unique: true }
);

// Find reviews for a user
reviewSchema.index({ reviewee: 1 });

// Find reviews for an item
reviewSchema.index({ item: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;