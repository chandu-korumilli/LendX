
import express from "express";

import {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} from "../controllers/itemController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new item
router.post("/", protect, createItem);

// Get all active items (with optional filters)
router.get("/", getAllItems);

// Get a single item by ID
router.get("/:id", getItemById);

// Update an item
router.put("/:id", protect, updateItem);

// Delete an item
router.delete("/:id", protect, deleteItem);

export default router;
