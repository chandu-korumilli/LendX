
import express from "express";

import { createItem, getAll } from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateQuery } from "../middleware/validate.js";
import { itemSearchSchema } from "../validators/itemValidator.js";

const router = express.Router();

// Create a new item (only logged-in users)
router.post("/", protect, createItem);
router.get("/search", validateQuery(itemSearchSchema), getAll);
router.get("/", validateQuery(itemSearchSchema), getAll);

export default router;
