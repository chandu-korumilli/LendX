
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createItem } from "../services/itemService";

function AddItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Electronics",
    condition: "good",
    pricePerDay: "",
    securityDeposit: "0",
    address: "",
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
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        condition: form.condition,
        pricePerDay: Number(form.pricePerDay),
        securityDeposit: Number(form.securityDeposit || 0),
        address: form.address.trim(),
        images: form.image.trim() ? [form.image.trim()] : []
      });

      setMessage("Item listed successfully! Redirecting...");

      setForm({
        title: "",
        description: "",
        category: "Electronics",
        condition: "good",
        pricePerDay: "",
        securityDeposit: "0",
        address: "",
        image: ""
      });

      setTimeout(() => {
        navigate("/explore");
      }, 1500);

    } catch (err) {
      setError(err.message || "Failed to create item");
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
          placeholder="e.g. Sony Alpha A7 Camera"
          value={form.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={100}
        />

        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="Electronics">Electronics</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Furniture">Furniture</option>
          <option value="Tools">Tools</option>
          <option value="Photography">Photography</option>
          <option value="Gaming">Gaming</option>
        </select>

        <label>Condition</label>
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          required
        >
          <option value="new">Brand New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good Condition</option>
          <option value="fair">Fair Condition</option>
          <option value="used">Used / Functional</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Detailed description of the item, accessories included, and rental terms..."
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
        />

        <label>Price per day (₹)</label>
        <input
          type="number"
          name="pricePerDay"
          placeholder="e.g. 250"
          value={form.pricePerDay}
          onChange={handleChange}
          min="1"
          required
        />

        <label>Security Deposit (₹)</label>
        <input
          type="number"
          name="securityDeposit"
          placeholder="e.g. 500"
          value={form.securityDeposit}
          onChange={handleChange}
          min="0"
        />

        <label>Location / Address</label>
        <input
          type="text"
          name="address"
          placeholder="e.g. Indiranagar, Bengaluru"
          value={form.address}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="url"
          name="image"
          placeholder="https://example.com/image.jpg"
          value={form.image}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
