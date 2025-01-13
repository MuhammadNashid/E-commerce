import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./ProfileInfo";
// import Cart from "./Cart";
import WishList from "./WishList";
import "./Profile.css"
import logo from "../assets/logout.png"

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");

  const token = localStorage.getItem("token");

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
          <button className="car1" onClick={() => handleSectionChange("cart")}>Cart</button>
          <button className="wi1" onClick={() => handleSectionChange("wishlist")}>Wishlist</button><br />
          <div className="lou" onClick={handleLogout}>
            <img className="img1" src={logo} alt="" />
            Logout</div>
        </div>
      </div>
      <div className="profile-content">
        {activeSection === "profile" && <ProfileInfo />}
        {activeSection === "cart" && <Cart />}
        {activeSection === "wishlist" && <WishList />}
      </div>
    </div>
  );
};

export default Profile;