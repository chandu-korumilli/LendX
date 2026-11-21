
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

// Allowed frontend origins & patterns
const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null;
const staticAllowedOrigins = [
    clientUrl,
    "https://lend-x-cfh2.vercel.app",
    "https://lend-x-cfh2-git-main-lend-x.vercel.app"
].filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    const cleanOrigin = origin.replace(/\/$/, "");
    if (staticAllowedOrigins.includes(cleanOrigin)) return true;
    // Allow any localhost or 127.0.0.1 with any port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) return true;
    // Allow any Vercel deployment preview / production domain
    if (/^https:\/\/[a-zA-Z0-9_-]+\.vercel\.app$/.test(cleanOrigin)) return true;
    return false;
};

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));

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
