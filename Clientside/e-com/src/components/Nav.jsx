


import React, { useState } from "react";
import "./Nav.css";
import { Link, useNavigate } from "react-router-dom";
import cartimg from "../assets/cart.png";
import wishlistimg from "../assets/wishlist.png"; // Add your wishlist icon here

const Nav = ({ setName }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Successfully logged out!");
    location.reload();
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <p className="logo">
          𝔽𝕃𝕀ℙ𝕂𝔸ℝ𝕋
          </p>
        </Link>
      </div>

      <div className="nav-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search for Products, Brand and more..."
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div className="nav-icons">
        <div className="cart-icon">
          <Link to="Cart">
            <img className="cart" src={cartimg} alt="cart" />
          </Link>
        </div>

        <div className="wishlist-icon">
          <Link to="Wishlist">
            <img className="wishlist" src={wishlistimg} alt="wishlist" />
          </Link>
        </div>
      </div>

      <div className="nav-links">
        {token ? (
          <div className="dropdown">
            <button className="profile-icon" onClick={toggleDropdown}>
            </button>
            {dropdownVisible && (
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout} className="lod">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="log">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;