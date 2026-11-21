import express from "express";

import {
    register,
    login,
    getMe,
    changePassword
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

import validate from "../middleware/validate.js";

import {
    registerSchema,
    loginSchema,
    changePasswordSchema
} from "../validators/authValidator.js";

const router = express.Router();

// Register
router.post(
    "/register",
    validate(registerSchema),
    register
);

// Login
router.post(
    "/login",
    validate(loginSchema),
    login
);

// Get current user
router.get(
    "/me",
    protect,
    getMe
);

// Change password
router.put(
    "/change-password",
    protect,
    validate(changePasswordSchema),
    changePassword
);

export default router;