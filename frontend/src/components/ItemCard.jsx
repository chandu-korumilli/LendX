
import React from "react";
import { useNavigate } from "react-router-dom";

function ItemCard({ item }) {
  const navigate = useNavigate();

  if (!item) return null;

  const itemImage =
    item.images?.find((image) => typeof image === "string") ||
    (typeof item.image === "string" ? item.image : "");

  return (
    <div
      className="item-card"
      onClick={() => navigate(`/items/${item._id || item.id}`)}
    >
      <div className="item-image">
        {itemImage ? (
          <img src={itemImage} alt={item.title} />
        ) : (
          <div className="item-no-image">📦</div>
        )}
      </div>

      <div className="item-content">
        <span className="item-category">
          {item.category || "General"}
        </span>

        <h3>{item.title}</h3>

        <p>{item.description}</p>

        <div className="item-bottom">
          <strong>
            ₹{item.pricePerDay ?? item.price ?? 0}
            <small> / day</small>
          </strong>

          <button
            className="item-view-btn"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/items/${item._id || item.id}`);
            }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
