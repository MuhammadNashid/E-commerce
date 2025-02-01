import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileInfo from "./ProfileInfo";
import Cart from "./Cart";
import WishList from "./WishList";
import MyOrder from "./MyOrder";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [accType, setAccType] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/api/getuserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setAccType(res.data.usr.accType);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [token, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      alert("Successfully logged out!");
      navigate("/login");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <h2>My Account</h2>
      <div>
          <button className="pro1" onClick={() => setActiveSection("profile")}>
            Profile
          </button>
          {accType === "buyer" && (
            <>
              <button className="car1" onClick={() => setActiveSection("cart")}>
                Cart
              </button>
              <button className="wi1" onClick={() => setActiveSection("wishlist")}>
                Wishlist
              </button>
              <button className="wil1" onClick={() => setActiveSection("orders")}>
                Orders
              </button>
              <br />
            </>
          )}
          <button className="lou" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
      </div>
      <div className="profile-content">
        {activeSection === "profile" && <ProfileInfo />}
        {activeSection === "cart" && accType === "buyer" && <Cart />}
        {activeSection === "wishlist" && accType === "buyer" && <WishList />}
        {activeSection === "orders" && accType === "buyer" && <MyOrder />}
      </div>
    </div>
  );
};

export default Profile;