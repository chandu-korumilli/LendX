
import React, { useState } from "react";
import { createItem } from "../services/itemService";

function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    pricePerDay: "",
    condition: "",
    image: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await createItem({
        ...form,
        pricePerDay: Number(form.pricePerDay)
      });

      setMessage("Item listed successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        address: "",
        pricePerDay: "",
        condition: "",
        image: ""
      });

    } catch (err) {
      setError(err.message || "Unable to list item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>List Your Item</h1>
        <p>Share your unused items with the community.</p>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <label>Item Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter item name"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe your item"
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Furniture">Furniture</option>
          <option value="Tools">Tools</option>
          <option value="Photography">Photography</option>
          <option value="Gaming">Gaming</option>
        </select>

        <label>Address / Location</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter your item location"
          required
        />

        <label>Price per day (₹)</label>
        <input
          type="number"
          name="pricePerDay"
          value={form.pricePerDay}
          onChange={handleChange}
          placeholder="Enter daily rental price"
          min="1"
          required
        />

        <label>Condition</label>
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          required
        >
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>

        <label>Image URL</label>
        <input
          type="url"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Paste image URL"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
