
import * as itemService from "../services/itemService.js";
import catchAsync from "../utils/catchAsync.js";

// Create a new item
export const createItem = catchAsync(async (req, res) => {
    const ownerId = req.user._id;
    const itemData = req.body;

    const item = await itemService.createItem(ownerId, itemData);

    res.status(201).json({
        success: true,
        message: "Item created successfully",
        data: item
    });
});

// Get all active items
export const getAllItems = catchAsync(async (req, res) => {
    const items = await itemService.getAllItems(req.validatedQuery);

    res.status(200).json({
        success: true,
        data: { items }
    });
});

// Get a single item by ID
export const getItemById = catchAsync(async (req, res) => {
    const item = await itemService.getItemById(req.params.id);

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found"
        });
    }

    res.status(200).json({
        success: true,
        data: { item }
    });
});

// Update an item
export const updateItem = catchAsync(async (req, res) => {
    const item = await itemService.updateItem(
        req.params.id,
        req.user._id,
        req.body
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found or you are not the owner"
        });
    }

    res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: { item }
    });
});

// Delete an item (soft delete)
// Delete an item (soft delete)
export const deleteItem = catchAsync(async (req, res) => {
    const item = await itemService.deleteItem(
        req.params.id,
        req.user._id
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found or you are not the owner"
        });
    }

    res.status(200).json({
        success: true,
        message: "Item deleted successfully"
    });
});