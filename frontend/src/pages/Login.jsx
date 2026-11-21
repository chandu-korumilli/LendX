
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    loginUser,
    getCurrentUser
} from "../services/authService";

import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
const location = useLocation();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    // Handle login submission
    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await loginUser(form);

            // Extract token from backend response
            const token =
                response.data?.token ||
                response.token ||
                response.accessToken ||
                response.data?.accessToken;

            if (!token) {
                throw new Error("Login token not received from server");
            }

            // Extract user information
            let userData =
                response.data?.user ||
                response.user ||
                null;

            // Save token before fetching profile
            localStorage.setItem("token", token);

            // Fetch profile if user details are not returned
            if (!userData) {
                const profile = await getCurrentUser();

                userData =
                    profile.data?.user ||
                    profile.user ||
                    profile.data ||
                    profile;
            }

            // Update global authentication state
            login(userData, token);

            // Navigate to homepage
const destination = location.state?.from || "/";
navigate(destination, { replace: true });
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <form className="auth-card" onSubmit={handleSubmit}>

                <h1>Welcome back!</h1>

                <p>Login to continue with LendX.</p>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <label>Email address</label>

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
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p>
                    Don't have an account?{" "}
<Link to="/register">Register</Link>                </p>

            </form>

        </div>
    );
}

export default Login;
