import { z } from "zod";

export const itemSearchSchema = z.object({
    title: z.string().trim().max(100, "Title search is too long").optional(),
    category: z.string().trim().max(100, "Category search is too long").optional()
}).strict();
