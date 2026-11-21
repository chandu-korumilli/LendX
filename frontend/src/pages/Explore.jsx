
import React, { useEffect, useState } from "react";
import { getItems } from "../services/itemService";
import ItemCard from "../components/ItemCard";

function Explore() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadItems(searchValue = search, categoryValue = category) {
    setLoading(true);
    setError("");

    try {
      const response = await getItems(searchValue, categoryValue);

      const itemList =
        response?.data?.items ||
        response?.items ||
        [];

      setItems(itemList);
    } catch (err) {
      setError(err.message || "Unable to load items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems("", "");
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadItems(search, category);
  }

  function handleReset() {
    setSearch("");
    setCategory("");
    loadItems("", "");
  }

  return (
    <div className="section">
      <span className="section-label">
        DISCOVER AND BORROW
      </span>

      <h2>
        Explore Items<span>.</span>
      </h2>

      <p>Find items available in your community.</p>

      {/* SEARCH AND FILTER */}
      <form
        className="explore-search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search by item title..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Furniture">Furniture</option>
          <option value="Tools">Tools</option>
          <option value="Photography">Photography</option>
          <option value="Gaming">Gaming</option>
        </select>

        <button type="submit">
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>

      {/* RESULTS */}
      <div className="explore-results">
        <h3>
          Available Items ({items.length})
        </h3>
      </div>

      {loading && (
        <p>Loading items...</p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="product-grid">
          {items.length > 0 ? (
            items.map((item) => (
              <ItemCard
                key={item._id || item.id}
                item={item}
              />
            ))
          ) : (
            <div className="featured-placeholder">
              <div className="placeholder-icon">
                📦
              </div>

              <h3>No items found</h3>

              <p>
                Try another search or select a different category.
              </p>

              <button
                className="primary-btn"
                onClick={handleReset}
              >
                Show All Items
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Explore;
