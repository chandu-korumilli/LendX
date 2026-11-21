import Item from "../validators/models/Item.js";

// Create a new item listing
export const createItem = async (userId, itemData) => {

    const item = await Item.create({
        owner: userId,
        ...itemData
    });

    return item;
};

// Get all active items (with optional filters)
export const getAllItems = async (filters = {}) => {

    const query = { status: "active", isAvailable: true };

    for (const field of ["title", "category"]) {
        const value = filters[field]?.trim();
        if (value) {
            const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            query[field] = { $regex: escapedValue, $options: "i" };
        }
    }

    const items = await Item.find(query)
        .populate("owner", "name email")
        .sort({ createdAt: -1 });

    return items;
};

// Get a single item by ID
export const getItemById = async (itemId) => {

    const item = await Item.findById(itemId)
        .populate("owner", "name email");

    return item;
};

// Update an item
export const updateItem = async (itemId, userId, updateData) => {

    const item = await Item.findOneAndUpdate(
        { _id: itemId, owner: userId },
        updateData,
        { new: true, runValidators: true }
    );

    return item;
};

// Delete (soft-remove) an item
export const deleteItem = async (itemId, userId) => {

    const item = await Item.findOneAndUpdate(
        { _id: itemId, owner: userId },
        { status: "removed" },
        { new: true }
    );

    return item;
};
