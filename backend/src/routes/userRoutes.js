import express from "express";
import { getMe, updateMe, getUserById } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

// Public profile — no auth required; must be defined after /me
router.get("/:id", getUserById);

export default router;
