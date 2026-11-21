
import * as itemService from "../services/itemservices.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new item
export const createItem = async (req, res, next) => {
    try {

        // Get logged-in user's ID
        const ownerId = req.user._id;

        // Get item details from request body
        const itemData = req.body;

        // Call service to create item
        const item = await itemService.createItem(
            ownerId,
            itemData
        );

        // Send success response
        res.status(201).json({
            success: true,
            message: "Item created successfully",
            data: item
        });

    } catch (error) {
        next(error);
    }
};

export const getAll = catchAsync(async (req, res) => {
    const items = await itemService.getAllItems(req.validatedQuery);

    res.status(200).json({
        success: true,
        data: { items }
    });
});
