import React, { useState, useEffect } from "react";
import axios from "axios";
 import "./cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [bill, setBill] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

    useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/getCart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setCartItems(res.data.cartItems); 
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);

  useEffect(() => {
    const calculateBill = () => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setBill(total);
    };

    calculateBill();
  }, [cartItems]);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/getUserAddresses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setAddresses(res.data.data); // Assuming your API returns 'addresses'
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to load addresses. Please try again.");
      }
    };

    fetchAddresses();
  }, [token]);

  const incrementQuantity = async (productId) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/incrementCartQuantity/${productId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productID === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error incrementing quantity:", err);
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/decrementCartQuantity/${productId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productID === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error decrementing quantity:", err);
    }
  };


  const deleteItem = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:3000/api/deleteCartItem/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setCartItems(cartItems.filter((item) => item.productID !== productId));
        alert("Product removed from cart.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete the item. Please try again.");
    }
  };


  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address to place the order.");
      return;
    }
    const fullAddress = `${selectedAddress.city}, ${selectedAddress.district}, ${selectedAddress.pincode}, ${selectedAddress.country}`;
    const orderData = {
      cartItems,
      address: fullAddress,
    };
  
    try {
      const res = await axios.post("http://localhost:3000/api/placeOrder", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 200) {
        alert("Order placed successfully!");
        setCartItems([]);
        setSelectedAddress(null);
        // Navigate to the success page
        navigate("/success"); // This will route to the OrderSuccess component
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place the order. Please try again.");
    }
  };
  

  if (loading) {
    return <div className="cart-content">Loading your cart...</div>;
  }

  if (error) {
    return <div className="cart-content error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <p className="hea">Your Cart</p>
        <div className="cart-left">
        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productID} className="cart-item">
                <div  className="image">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="caimage"
                /></div>
                <div className="cart-item-details">
                  <h3><b> Name:</b>{item.name}</h3>
                  <p className="des"><b> Des:</b>{item.description}</p>
                  <p className="pri"><b> Price:</b> ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => decrementQuantity(item.productID)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.productID)}>
                      +
                    </button>
                  </div>
                  <div className="de1">
                  <button
                    className="sbutton">
                    Save For Later
                  </button>
                  <button
                    className="dbutton"
                    onClick={() => deleteItem(item.productID)}
                  >
                    Remove
                  </button></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No items in your cart yet.</div>
        )}
      </div>
    </div>


    {cartItems.length > 0 && (
  <div className="bisection">
    <div className="sbill">
      <p className="h2">Price Details</p>
      <p>
        <b className="bd">Price:</b> <span className="spa">₹{bill}</span>
      </p>
      <p >
        <b className="bd">Discount:</b>{" "}
        <span className="spa2">{bill * 0.1}%</span> {/* Assuming a 10% discount */}
      </p>
      <p >
        <b className="bd">Delivery Charge:</b>{" "}
        <span className="spa2">{bill > 500 ? 0 : 50}</span> {/* Free delivery for orders above ₹500 */}
      </p>
      <p>________________________________________________</p>
      <p>
        <b className="bd1">Total Amount:</b>{" "}
        <span className="spa1">
          {bill - bill * 0.1 + (bill > 500 ? 0 : 50)}
        </span>
      </p>
    </div>
    <div className="address-section">
      <p className="h3">Select Address</p>
      {addresses.length > 0 ? (
        <div className="address-options">
          {addresses.map((address, index) => (
            <div key={index} className="address-item">
              <label className="address-option">
                <input
                  type="radio"
                  name="address"
                  className="dw"
                  value={index}
                  onChange={() => setSelectedAddress(address)}
                />
                {`${address.city}, ${address.district}, ${address.pincode}, ${address.country}`}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p>No addresses found. Please add an address in your profile.</p>
      )}
      {selectedAddress && (
        <div className="selected-address">
          <p>
            <b>Selected Address:</b>{" "}
            {`${selectedAddress.city}, ${selectedAddress.district}, ${selectedAddress.pincode}, ${selectedAddress.country}`}
          </p>
        </div>
      )}
    </div>
    <div className="undb">
      <button className="pobutton" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Cart;