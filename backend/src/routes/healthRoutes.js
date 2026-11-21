import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Check whether the backend and database are running
router.get("/", (req, res) => {

    const dbStatus = mongoose.connection.readyState;

    res.status(dbStatus === 1 ? 200 : 503).json({
        success: dbStatus === 1,
        message: "LendX API Health Check",
        server: "Running",
        database: dbStatus === 1 ? "Connected" : "Disconnected"
    });

});

export default router;