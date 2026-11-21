import User from "../validators/models/User.js";

// Get the logged-in user's profile
export const getMyProfile = async (userId) => {
    const user = await User.findById(userId);

    return user;
};

// Get a user's public profile by ID
export const getPublicProfile = async (userId) => {
    const user = await User.findById(userId).select(
        "name bio avatar location averageRating reviewCount createdAt"
    );

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

// Update the logged-in user's profile
export const updateMyProfile = async (userId, profileData) => {

    // Allow only these fields to be updated
    const allowedUpdates = {};

    const allowedFields = ["name", "phone", "bio", "location"];

    allowedFields.forEach((field) => {
        if (profileData[field] !== undefined) {
            allowedUpdates[field] = profileData[field];
        }
    });

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        allowedUpdates,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedUser;
};