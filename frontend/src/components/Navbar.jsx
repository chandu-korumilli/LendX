import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();

  const { user, loading, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          Lend<span>X</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>

          {user && (
            <Link to="/bookings">Bookings</Link>
          )}
        </nav>

        <div className="nav-actions">

          {!loading && !user && (
            <>
              <button
                className="nav-login"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="primary-btn nav-register"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          )}

          {!loading && user && (
            <>
              <button
                className="nav-login"
                onClick={() => navigate("/profile")}
              >
                {user.name || "My Profile"}
              </button>

              <button
                className="primary-btn nav-register"
                onClick={() => navigate("/add-item")}
              >
                Add Item
              </button>

              <button
                className="nav-login"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;