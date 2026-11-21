
import React, { useState } from "react";
import { createItem } from "../services/itemService";

function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      await createItem({
        ...form,
        price: Number(form.price)
      });

      setMessage("Item listed successfully!");

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
        image: ""
      });
    } catch (err) {
      setError(err.message);
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
        <input name="title" value={form.title}
          onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description}
          onChange={handleChange} required />

        <label>Category</label>
        <input name="category" value={form.category}
          onChange={handleChange} required />

        <label>Price per day (₹)</label>
        <input type="number" name="price" value={form.price}
          onChange={handleChange} min="1" required />

        <label>Image URL</label>
        <input name="image" value={form.image}
          onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
