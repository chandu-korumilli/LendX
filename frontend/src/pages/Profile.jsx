
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        const userData = data.data?.user || data.user || data;
        setUser(userData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="section">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <p className="error-message">{error}</p>
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="section">
      <span className="section-label">YOUR ACCOUNT</span>
      <h2>My Profile<span>.</span></h2>

      <div className="auth-card" style={{ maxWidth: "550px", marginTop: "20px" }}>
        <h3>{user.name}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        {user.role && <p><strong>Role:</strong> {user.role.toUpperCase()}</p>}
        {user.location && <p><strong>Location:</strong> {user.location}</p>}
        {user.createdAt && (
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </p>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
          <button className="primary-btn" onClick={() => navigate("/bookings")}>
            My Bookings
          </button>
          <button className="secondary-btn" onClick={() => navigate("/explore")}>
            Explore Items
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
