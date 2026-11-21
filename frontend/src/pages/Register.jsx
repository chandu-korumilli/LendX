
import React, { useState } from "react";
import { registerUser } from "../services/authService";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    // Register new user
    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await registerUser(form);

            setSuccess(
                "Registration successful! Please login to continue."
            );

            setForm({
                name: "",
                email: "",
                password: ""
            });

        } catch (err) {
            setError(err.message || "Registration failed");

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h1>Create Account</h1>

                <p>Join the LendX sharing community.</p>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                <label>Full Name</label>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={50}
                />

                <label>Email Address</label>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p>
                    Already registered?{" "}
                    <a href="/login">Login</a>
                </p>

            </form>

        </div>
    );
}

export default Register;
