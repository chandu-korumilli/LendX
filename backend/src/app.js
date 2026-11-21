
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Import middleware
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test route
app.get("/test-route", (req, res) => {
    res.status(200).send("Express server is working");
});

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);

// Public booking test route
// IMPORTANT: This must come before bookingRoutes.
app.get("/api/bookings/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Booking routes are working"
    });
});

// Protected booking routes
app.use("/api/bookings", bookingRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
