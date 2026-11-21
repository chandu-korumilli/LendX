import { z } from "zod";

const dateString = z.string().refine(
    (value) => !Number.isNaN(Date.parse(value)),
    "Enter a valid date"
);

export const createBookingSchema = z.object({
    itemId: z.string().regex(/^[a-f\d]{24}$/i, "Enter a valid item ID"),
    startDate: dateString,
    endDate: dateString
}).strict().refine(
    ({ startDate, endDate }) => new Date(endDate) > new Date(startDate),
    {
        message: "End date must be after start date",
        path: ["endDate"]
    }
);
