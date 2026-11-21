
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

// Allowed frontend origins
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://lend-x-cfh2.vercel.app",
    "https://lend-x-cfh2-git-main-lend-x.vercel.app",
    "http://localhost:5173"
].filter(Boolean);

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith(".vercel.app")
        ) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
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
