
import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user || data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="section">{error}</div>;
  if (!user) return <div className="section">Loading profile...</div>;

  return (
    <div className="section">
      <span className="section-label">YOUR ACCOUNT</span>
      <h2>My Profile<span>.</span></h2>

      <div className="auth-card">
        <h3>{user.name}</h3>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
