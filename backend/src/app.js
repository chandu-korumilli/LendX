
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemroutes.js";
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
    "https://lend-x-cfh2-git-main-lend-x.vercel.app"
].filter(Boolean);

// Only the project's own Vercel deployments (production + branch previews)
const VERCEL_ORIGIN = /^https:\/\/lend-x-cfh2(-git-[a-z0-9-]+)?\.vercel\.app$/;

const isAllowedOrigin = (origin) => {
    if (allowedOrigins.includes(origin)) {
        return true;
    }

    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return true;
    }

    return VERCEL_ORIGIN.test(origin);
};

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        const error = new Error("Not allowed by CORS");
        error.statusCode = 403;
        return callback(error);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Logger
app.use(morgan("dev"));

// Body parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

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
