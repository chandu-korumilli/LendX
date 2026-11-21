import "dotenv/config";

import mongoose from "mongoose";

import connectDB from "../config/db.js";

import User from "../validators/models/User.js";
import Item from "../validators/models/Item.js";
import Booking from "../validators/models/Booking.js";
import Review from "../validators/models/Review.js";
import Report from "../validators/models/Report.js";

const modelCheck = async () => {

    try {

        // Connect to MongoDB
        await connectDB();

        // Ensure all indexes are created
        await Promise.all([
            User.init(),
            Item.init(),
            Booking.init(),
            Review.init(),
            Report.init()
        ]);

        console.log("\nCreating test documents...\n");

        // 1. Create User
        const user = await User.create({
            name: "Test User",
            email: "testlendx@example.com",
            password: "TestPassword123"
        });

        console.log("USER CREATED:");
        console.log(user);

        // 2. Create Item
        const item = await Item.create({
            owner: user._id,
            title: "Test Bicycle",
            description: "A bicycle for borrowing",
            category: "Sports",
            condition: "good",
            pricePerDay: 100,
            securityDeposit: 500,
            location: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            address: "Test Address"
        });

        console.log("\nITEM CREATED:");
        console.log(item);

        // 3. Create Booking
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 2);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3);

        const booking = await Booking.create({
            item: item._id,
            borrower: user._id,
            lender: user._id,
            startDate,
            endDate,
            totalDays: 3,
            pricePerDay: 100,
            securityDeposit: 500,
            totalPrice: 300
        });

        console.log("\nBOOKING CREATED:");
        console.log(booking);

        // 4. Create Review
        const review = await Review.create({
            booking: booking._id,
            reviewer: user._id,
            reviewee: user._id,
            item: item._id,
            rating: 5,
            comment: "Good experience"
        });

        console.log("\nREVIEW CREATED:");
        console.log(review);

        // 5. Create Report
        const report = await Report.create({
            reporter: user._id,
            targetType: "item",
            targetItem: item._id,
            reason: "other",
            description: "Test report"
        });

        console.log("\nREPORT CREATED:");
        console.log(report);

        console.log("\nAll five models tested successfully!");

    } catch (error) {

        console.error("\nModel testing failed:");
        console.error(error);

    } finally {

        // Delete test documents
        await Review.deleteMany({
            comment: "Good experience"
        });

        await Report.deleteMany({
            description: "Test report"
        });

        await Booking.deleteMany({
            totalPrice: 300
        });

        await Item.deleteMany({
            title: "Test Bicycle"
        });

        await User.deleteMany({
            email: "testlendx@example.com"
        });

        console.log("\nTest documents cleaned up.");

        await mongoose.disconnect();

    }

};

modelCheck();