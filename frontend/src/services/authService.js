
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Register a new user
export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    // Save JWT token
    if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
    }

    return data;
}

// Login existing user
export async function loginUser(userData) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    // Save JWT token
    if (data.data?.token) {
        localStorage.setItem("token", data.data.token);
    }

    return data;
}

// Get currently logged-in user
export async function getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to fetch profile");
    }

    return data;
}

// Logout user
export function logoutUser() {
    localStorage.removeItem("token");
}
