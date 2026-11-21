
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
  };
}

// Get all items with optional search and category filters
export async function getItems(search = "", category = "") {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.append("title", search.trim());
  }

  if (category) {
    params.append("category", category);
  }

  const response = await fetch(
    `${API_URL}/items?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to fetch items");
  }

  return data;
}

// Get one item by ID
export async function getItemById(id) {
  const response = await fetch(`${API_URL}/items/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Item not found");
  }

  return data;
}

// Create an item
export async function createItem(itemData) {
  const response = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(itemData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create item");
  }

  return data;
}

// Update an item
export async function updateItem(id, itemData) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(itemData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update item");
  }

  return data;
}

// Delete an item
export async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete item");
  }

  return data;
}
