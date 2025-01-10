import React from "react";
import "./Cart1.css"

const Cart = () => {
  return (
    <div className="cart-content1">
      <div className="carts">
      <h2 className="ycar1">Your Cart</h2>
      {/* Cart items would be dynamically rendered here */}
      <div className="no1">No items </div>
    </div>
    </div>
  );
};

export default Cart;