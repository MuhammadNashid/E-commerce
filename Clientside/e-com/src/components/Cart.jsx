import React from "react";
import "./cart.css"

const Cart = () => {
  return (
    <div className="cart-content">
      <div className="cart1">
      <h2 className="ycar">Your Cart</h2>
      {/* Cart items would be dynamically rendered here */}
      <div className="no">No items </div>
    </div>
    </div>
  );
};

export default Cart;