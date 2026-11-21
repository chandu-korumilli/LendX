
import express from "express";

import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js";
import validate, { validateQuery } from "../middleware/validate.js";
import { itemSearchSchema, createItemSchema, updateItemSchema } from "../validators/itemValidator.js";

const router = express.Router();

// Create a new item
router.post("/", protect, validate(createItemSchema), createItem);

// Get all active items (with optional filters)
router.get("/", validateQuery(itemSearchSchema), getAllItems);

// Get a single item by ID
router.get("/:id", getItemById);

// Update an item
router.put("/:id", protect, validate(updateItemSchema), updateItem);

// Delete an item
router.delete("/:id", protect, deleteItem);

export default router;
