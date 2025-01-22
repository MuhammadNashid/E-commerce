

import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import Cart from "./Cart";
import WishList from "./WishList";
import "./Profile.css"
import Myorder from "./Myorder"

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [accType, setAccType] = useState(null); // To store the user's account type
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:3006/api/getuserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          const user = res.data.usr;
          setAccType(user.accType); // Set the user's account type
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleLogout = () => {
    const confirmDelete = window.confirm("Are you sure you want to Logout?");
    if (!confirmDelete) return;
    localStorage.removeItem("token");
    alert("Successfully logged out!");
    navigate("/login");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <h2 className="acc">My Account</h2>
        <div>
          <button className="pro1" onClick={() => handleSectionChange("profile")}>Profile</button>
          {accType === "buyer" && (
          <>
          <button className="car1" onClick={() => handleSectionChange("cart")}>Cart</button>
          <button className="wi1" onClick={() => handleSectionChange("wishlist")}>Wishlist</button>
          <button className="wil1" onClick={() => handleSectionChange("orders")}>My Orders</button><br />
        </>
       )} 
          <button className="lou" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="profile-content">
        {activeSection === "profile" && <ProfileInfo />}
        {activeSection === "cart" && accType === "buyer" &&  <Cart />}
        {activeSection === "wishlist" && accType === "buyer" &&  <WishList />}
        {activeSection === "myorder" && accType === "buyer" &&  <Myorder/>}
      </div>
    </div>
  );
};

export default Profile;