
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-about">
          <Link to="/" className="logo footer-logo">
            Lend<span>X</span>
          </Link>

          <p>
            A smarter way to rent, lend and share.
            Making everyday access affordable and convenient.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/explore">Browse Items</Link>
          <Link to="/add-item">List an Item</Link>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/bookings">My Bookings</Link>
        </div>

        <div className="footer-links">
          <h3>About LendX</h3>
          <p>Rent smarter.</p>
          <p>Share better.</p>
          <p>Earn more.</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LendX. All rights reserved.</p>
        <p>Made for smarter sharing.</p>
      </div>
    </footer>
  );
}

export default Footer;
