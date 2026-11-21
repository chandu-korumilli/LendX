import mongoose from "mongoose";
import User from "../validators/models/User.js";
import Item from "../validators/models/Item.js";
import Booking from "../validators/models/Booking.js";
import Review from "../validators/models/Review.js";
import Report from "../validators/models/Report.js";

const models = [User, Item, Booking, Review, Report];

const initializeModels = async () => {
    await Promise.all(models.map(async (model) => {
        const collectionName = model.collection.collectionName;
        const collectionExists = await mongoose.connection.db
            .listCollections({ name: collectionName }, { nameOnly: true })
            .hasNext();

        if (!collectionExists) {
            await model.createCollection();
        }

        await model.init();
    }));
};

// Function to connect MongoDB
const connectDB = async () => {
    try {
        // Connect using the MongoDB URL
        const conn = await mongoose.connect(process.env.MONGO_URI);

        await initializeModels();

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);

        // Stop the application if database connection fails
        process.exit(1);
    }
};

export default connectDB;