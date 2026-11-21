import dotenv from "dotenv";
import path from "node:path";
import dns from "node:dns";

// Load .env from root or backend directory
dotenv.config();
dotenv.config({ path: path.resolve(import.meta.dirname, "../.env") });

// Fix for Windows DNS resolving MongoDB Atlas SRV records
try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
    // Ignore if system restricts custom DNS
}

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`LendX Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();