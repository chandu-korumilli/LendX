import catchAsync from "../utils/catchAsync.js";

import {
    registerUser,
    loginUser,
    getCurrentUser,
    changeUserPassword
} from "../services/authService.js";

// Register controller
export const register = catchAsync(async (req, res) => {

    const result = await registerUser(req.body);

    res.status(201).json({
        success: true,
        message: "Registration successful",
        data: result
    });

});

// Login controller
export const login = catchAsync(async (req, res) => {

    const result = await loginUser(req.body);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });

});

// Get logged-in user controller
export const getMe = catchAsync(async (req, res) => {

    const user = await getCurrentUser(req.user._id);

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });

});

// Change password controller
export const changePassword = catchAsync(async (req, res) => {

    const result = await changeUserPassword(
        req.user._id,
        req.body.currentPassword,
        req.body.newPassword
    );

    res.status(200).json({
        success: true,
        message: result.message
    });

});