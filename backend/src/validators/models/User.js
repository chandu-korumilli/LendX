import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    // Basic account details
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },

   email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
    ]
},

    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },

    // User role
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    // Profile information
    phone: {
    type: String,
    trim: true,
    default: "",
    validate: {
        validator: function(value) {
            return value === "" || /^[0-9]{10}$/.test(value);
        },
        message: "Phone number must contain exactly 10 digits"
    }
},
bio: {
    type: String,
    maxlength: 300,
    default: ""
},

    avatar: {
        type: String,
        default: ""
    },

  location: {
    type: String,
    trim: true,
    maxlength: 100,
    default: ""
},

    // Rating information
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
    },

    // Account management
    isBanned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;