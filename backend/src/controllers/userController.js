import catchAsync from "../utils/catchAsync.js";
import { getMyProfile, updateMyProfile, getPublicProfile } from "../services/userService.js";

// Get logged-in user's profile
export const getMe = catchAsync(async (req, res) => {

    const user = await getMyProfile(req.user._id);

    res.status(200).json({
        success: true,
        data: { user }
    });

});

// Get a user's public profile by ID
export const getUserById = catchAsync(async (req, res) => {

    const user = await getPublicProfile(req.params.id);

    res.status(200).json({
        success: true,
        data: { user }
    });

});

// Update logged-in user's profile
export const updateMe = catchAsync(async (req, res) => {

    const user = await updateMyProfile(req.user._id, req.body);

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user }
    });

});
