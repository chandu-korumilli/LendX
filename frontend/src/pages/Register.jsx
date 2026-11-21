
import { useState } from "react";
import { registerUser } from "../services/authService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({
        name: "",
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

    // Register new user
    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await registerUser(form);
            const token =
                response.data?.token ||
                response.token ||
                response.accessToken;
            const user =
                response.data?.user ||
                response.user;

            if (!token || !user) {
                throw new Error("Registration response is missing account details");
            }

            login(user, token);
            navigate("/", { replace: true });

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
                    minLength={8}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                </button>

                <p>
                    Already registered?{" "}
<Link to="/login">Login</Link>                </p>

            </form>

        </div>
    );
}

export default Register;
