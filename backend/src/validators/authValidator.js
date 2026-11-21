import { z } from "zod";

// Registration validation
export const registerSchema = z.object({

    name: z.string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(50),

    email: z.string()
        .trim()
        .email("Enter a valid email"),

    password: z.string()
        .min(8, "Password must contain at least 8 characters")
        .max(72, "Password is too long")

});

// Login validation
export const loginSchema = z.object({

    email: z.string()
        .trim()
        .email("Enter a valid email"),

    password: z.string()
        .min(1, "Password is required")
        .max(72)

});

// Change password validation
export const changePasswordSchema = z.object({

    currentPassword: z.string()
        .min(1, "Current password is required"),

    newPassword: z.string()
        .min(8, "New password must contain at least 8 characters")
        .max(72, "Password is too long")

}).refine(
    data => data.currentPassword !== data.newPassword,
    {
        message: "New password must be different",
        path: ["newPassword"]
    }
);