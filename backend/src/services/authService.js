import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../validators/models/User.js";

// Generate JWT token
const generateToken = (userId) => {

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
};

// Remove password from response
const formatUser = (user) => {

    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};

// Register user
export const registerUser = async (data) => {

    // Check existing email
    const existingUser = await User.findOne({
        email: data.email
    });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword
    });

    // Generate token
    const token = generateToken(user._id);

    return {
        user: formatUser(user),
        token
    };
};

// Login user
export const loginUser = async (data) => {

    // Find user and include password
    const user = await User.findOne({
        email: data.email
    }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Block banned users
    if (user.isBanned) {
        const error = new Error("Your account has been banned");
        error.statusCode = 403;
        throw error;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // Generate token
    const token = generateToken(user._id);

    return {
        user: formatUser(user),
        token
    };
};

// Get current user
export const getCurrentUser = async (userId) => {

    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.isBanned) {
        const error = new Error("Your account has been banned");
        error.statusCode = 403;
        throw error;
    }

    return formatUser(user);
};

// Change password
export const changeUserPassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    // Get current password hash
    const user = await User.findById(userId).select("+password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.isBanned) {
        const error = new Error("Your account has been banned");
        error.statusCode = 403;
        throw error;
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        const error = new Error("Current password is incorrect");
        error.statusCode = 400;
        throw error;
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return {
        message: "Password changed successfully"
    };
};