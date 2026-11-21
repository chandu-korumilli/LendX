import { z } from "zod";

export const itemSearchSchema = z.object({
    title: z.string().trim().max(100, "Title search is too long").optional(),
    category: z.string().trim().max(100, "Category search is too long").optional()
}).strict();

export const createItemSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be under 100 characters"),
    description: z.string().trim().min(1, "Description is required").max(2000, "Description is too long"),
    category: z.string().trim().min(1, "Category is required"),
    condition: z.enum(["new", "like-new", "good", "fair", "used"]).optional().default("good"),
    pricePerDay: z.coerce.number().min(0, "Price must be non-negative").optional(),
    price: z.coerce.number().min(0, "Price must be non-negative").optional(),
    securityDeposit: z.coerce.number().min(0).optional().default(0),
    address: z.string().trim().min(1, "Address is required").optional().default("Location not specified"),
    images: z.array(z.string().trim()).max(4, "Maximum 4 images allowed").optional(),
    image: z.string().trim().optional()
}).refine(data => data.pricePerDay !== undefined || data.price !== undefined, {
    message: "Price per day is required",
    path: ["pricePerDay"]
});

export const updateItemSchema = z.object({
    title: z.string().trim().min(3).max(100).optional(),
    description: z.string().trim().max(2000).optional(),
    category: z.string().trim().optional(),
    condition: z.enum(["new", "like-new", "good", "fair", "used"]).optional(),
    pricePerDay: z.coerce.number().min(0).optional(),
    price: z.coerce.number().min(0).optional(),
    securityDeposit: z.coerce.number().min(0).optional(),
    address: z.string().trim().optional(),
    images: z.array(z.string().trim()).max(4).optional(),
    image: z.string().trim().optional(),
    isAvailable: z.boolean().optional(),
    status: z.enum(["active", "hidden", "removed"]).optional()
});
