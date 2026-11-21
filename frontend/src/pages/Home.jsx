
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemCard from "../components/ItemCard";
import { useAuth } from "../context/AuthContext.jsx";
import { getItems } from "../services/itemService";

function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "Electronics",
    "Vehicles",
    "Furniture",
    "Tools",
    "Photography",
    "Gaming"
  ];

  const features = [
    {
      icon: "💰",
      title: "Save More",
      description:
        "Rent the things you need instead of spending money buying them."
    },
    {
      icon: "💼",
      title: "Earn More",
      description:
        "List your unused items and earn money by renting them to others."
    },
    {
      icon: "🛡️",
      title: "Rent Safely",
      description:
        "Connect with other users and enjoy a convenient rental experience."
    }
  ];

  // Navigate according to login status
  function handleStartEarning() {
    if (authLoading) return;

    if (user) {
      navigate("/add-item");
    } else {
      navigate("/login", {
        state: { from: "/add-item" }
      });
    }
  }

  // Fetch available items
  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        setError("");

        const result = await getItems();
        const fetchedItems =
          result?.data?.items ||
          result?.items ||
          [];

        setItems(fetchedItems.slice(0, 6));

      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">

          <span className="hero-tag">
            Welcome to LendX
          </span>

          <h1>
            Rent What You Need.
            <br />
            <span>Share What You Have.</span>
          </h1>

          <p>
            Discover affordable rentals around you. Borrow items
            when you need them and earn money by sharing what
            you own.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/explore")}
            >
              Explore Items
            </button>

            <button
              className="secondary-btn"
              onClick={handleStartEarning}
              disabled={authLoading}
            >
              {authLoading ? "Please wait..." : "Start Earning"}
            </button>

          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
            alt="Online rental marketplace"
          />
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="home-search-section">
        <div>
          <h2>Find Anything You Need</h2>
          <p>Explore affordable items available for rent.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/explore")}
        >
          Browse Rentals
        </button>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">

        <div className="section-heading">
          <div>
            <h2>Explore Categories</h2>
            <p>Find the right item for your needs.</p>
          </div>
        </div>

        <div className="category-grid">

          {categories.map((category) => (
            <div
              className="category-card"
              key={category}
              onClick={() =>
                navigate(
                  `/explore?category=${encodeURIComponent(category)}`
                )
              }
            >
              <h3>{category}</h3>
              <span>Explore →</span>
            </div>
          ))}

        </div>
      </section>

      {/* FEATURED ITEMS */}
      <section className="featured-section">

        <div className="section-heading">
          <div>
            <h2>Featured Rentals</h2>
            <p>Discover items shared by our community.</p>
          </div>

          <button
            className="text-btn"
            onClick={() => navigate("/explore")}
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="featured-placeholder">
            <h3>Loading available items...</h3>
            <p>Please wait while we find rentals for you.</p>
          </div>

        ) : error ? (
          <div className="featured-placeholder">
            <h3>Unable to load items</h3>
            <p>{error}</p>

            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>

        ) : items.length > 0 ? (
          <div className="featured-items-grid">
            {items.map((item) => (
              <ItemCard
                key={item._id || item.id}
                item={item}
              />
            ))}
          </div>

        ) : (
          <div className="featured-placeholder">
            <div className="placeholder-icon">📦</div>

            <h3>No items available yet</h3>

            <p>
              Be the first to share an item with the LendX community.
            </p>

            <button
              className="primary-btn"
              onClick={handleStartEarning}
              disabled={authLoading}
            >
              List Your Item
            </button>
          </div>
        )}

      </section>

      {/* WHY LENDX */}
      <section className="features-section">

        <div className="section-heading centered-heading">
          <h2>Why Choose LendX?</h2>
          <p>A smarter way to rent, share and earn.</p>
        </div>

        <div className="features-grid">

          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

            </div>
          ))}

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta-section">

        <h2>Have Something to Share?</h2>

        <p>
          Turn your unused items into extra income with LendX.
        </p>

        <button
          className="primary-btn"
          onClick={handleStartEarning}
          disabled={authLoading}
        >
          Start Renting Today
        </button>

      </section>

    </div>
  );
}

export default Home;
