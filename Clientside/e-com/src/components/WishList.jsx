import React from "react";
import "./wish.css"
const Wishlist = () => {
  return (
    <div className="wishlist-content">
      <div className="cart1">
      <h2 className="ycar">Your Wishlist</h2>
      {/* Wishlist items would be dynamically rendered here */}
      <div className="no">No items</div>
    </div>
    </div>
  );
};

export default Wishlist;