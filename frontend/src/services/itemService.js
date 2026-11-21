
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getItems } from "../services/itemService";
import ItemCard from "../components/ItemCard";

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "Electronics",
    "Vehicles",
    "Furniture",
    "Tools",
    "Photography",
    "Gaming"
  ];

  // Load items whenever the URL filters change
  useEffect(() => {
    const selectedSearch = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "";

    setSearch(selectedSearch);
    setCategory(selectedCategory);

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const response = await getItems(
          selectedSearch,
          selectedCategory
        );

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

    loadItems();
  }, [searchParams]);

  // Apply search and category filters
  function handleSearch(event) {
    event.preventDefault();

    const params = {};

    if (search.trim()) {
      params.search = search.trim();
    }

    if (category) {
      params.category = category;
    }

    setSearchParams(params);
  }

  // Clear all filters
  function handleReset() {
    setSearch("");
    setCategory("");
    setSearchParams({});
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

      {/* SEARCH AND CATEGORY FILTER */}
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

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
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

      {/* RESULTS HEADING */}
      <div className="explore-results">
        <h3>
          {category ? `${category} Items` : "Available Items"}
          {" "}({items.length})
        </h3>
      </div>

      {/* LOADING */}
      {loading && <p>Loading items...</p>}

      {/* ERROR */}
      {!loading && error && (
        <p className="error-message">{error}</p>
      )}

      {/* ITEM RESULTS */}
      {!loading && !error && (
        items.length > 0 ? (
          <div className="product-grid">
            {items.map((item) => (
              <ItemCard
                key={item._id || item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="featured-placeholder">
            <div className="placeholder-icon">
              📦
            </div>

            <h3>
              {category
                ? `No ${category} items available`
                : "No items found"}
            </h3>

            <p>
              {category
                ? `There are currently no available items in ${category}. Try another category.`
                : "No items match your search. Try different search terms."}
            </p>

            <button
              className="primary-btn"
              onClick={handleReset}
            >
              Show All Items
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Explore;
