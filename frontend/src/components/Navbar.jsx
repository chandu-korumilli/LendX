
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo">
          Lend<span>X</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/bookings">Bookings</Link>
        </nav>

        <div className="nav-actions">
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
        </div>

      </div>
    </header>
  );
}

export default Navbar;
