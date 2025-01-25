import React from "react";
import { useNavigate } from "react-router-dom";
import './success.css'; // Import the CSS file for styling

const OrderSuccess = () => {
    const navigate = useNavigate();
  
    const handleNavigation = () => {
      try {
        navigate("/");
      } catch (error) {
        console.error("Navigation failed:", error);
      }
    };
  
    return (
      <div className="order-success">
        <div className="tick-icon">&#x2714;</div> {/* Unicode checkmark */}
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase. Your order is being processed.</p>
        <button onClick={handleNavigation}>Go to Home</button>
      </div>
    );
  };

export default OrderSuccess;
