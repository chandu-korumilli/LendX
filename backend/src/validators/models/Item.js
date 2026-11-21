import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({

    // User who owns and lists the item
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Item details
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },

    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    condition: {
        type: String,
        required: true,
        enum: [
            "new",
            "like-new",
            "good",
            "fair",
            "used"
        ]
    },

    // Maximum four item images
    images: {
        type: [{
            type: String,
            trim: true
        }],
        default: [],
        validate: {
            validator: function (images) {
                return images.length <= 4;
            },
            message: "Maximum 4 images are allowed"
        }
    },

    // Rental information
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

    // GeoJSON location
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
            validate: {
                validator: function (coordinates) {
                    return coordinates.length === 2 &&
                        coordinates[0] >= -180 &&
                        coordinates[0] <= 180 &&
                        coordinates[1] >= -90 &&
                        coordinates[1] <= 90;
                },
                message: "Invalid GeoJSON coordinates"
            }
        }
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    // Availability
    isAvailable: {
        type: Boolean,
        default: true
    },

    // Listing status
    status: {
        type: String,
        enum: ["active", "hidden", "removed"],
        default: "active"
    },

    // Rating details
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    reviewCount: {
        type: Number,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});

// Location-based searching
itemSchema.index({ location: "2dsphere" });

// Text-based searching
itemSchema.index({
    title: "text",
    description: "text"
});

// Search owner's listings
itemSchema.index({ owner: 1, status: 1 });

const Item = mongoose.model("Item", itemSchema);

export default Item;