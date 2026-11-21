import express from "express";

import {
    createRequest,
    listMine
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { createBookingSchema } from "../validators/bookingValidator.js";

const router = express.Router();

router.use(protect);
router.post("/", validate(createBookingSchema), createRequest);
router.get("/", listMine);

export default router;
