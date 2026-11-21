import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemroutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.get("/test-route", (req, res) => {
    res.send("Express server is working");
});

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

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// VERY IMPORTANT
export default app;