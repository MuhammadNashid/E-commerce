

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Myorder.css";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/getBuyerOrder`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="centerText">Loading orders...</div>;
  }

  if (error) {
    return <div className="centerText errorText">Error: {error}</div>;
  }

  return (
    <div className="container">
      <h1 className="heading">My Orders</h1>
      {orders.length === 0 ? (
        <div className="centerText">No orders found.</div>
      ) : (
        <div className="orderList">
          {orders.map((order, index) => {
            // Ensuring price is a number for calculations
            const price = Number(order.price);
            const totalPrice = price * order.quantity;
            return (
              <div key={index} className="orderCard">
                <img src={order.thumbnail} alt={order.name} className="orderThumbnail" />
                <h2 className="productName">{order.name}</h2>
                <p>Quantity: {order.quantity}</p>
                <p>Price: {isNaN(price) ? "$0.00" : `$${price.toFixed(2)}`}</p>
                <p>Total Price: {isNaN(totalPrice) ? "$0.00" : `$${totalPrice.toFixed(2)}`}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
