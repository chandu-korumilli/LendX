import jwt from "jsonwebtoken";
import User from "../validators/models/User.js";

// Protect routes using JWT
export const protect = async (req, res, next) => {

    try {

        // Get authorization header
        const authHeader = req.headers.authorization;

        // Check Bearer token
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // Block banned accounts
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: "Your account has been banned"
            });
        }

        // Store user in request
        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        next(error);
    }
};

// Check user role
export const authorize = (...roles) => {

    return (req, res, next) => {

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission"
            });
        }

        next();
    };
};