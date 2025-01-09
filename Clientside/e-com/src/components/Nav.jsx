import React from "react";
import "./Nav.css"
import { Link, useNavigate } from "react-router-dom";
import cartimg from "../assets/cart.png"

const Nav = ({setName}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Successfully logged out!");
    location.reload()
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1  className="logo">𝙁𝙇𝙄𝙋𝙆𝘼𝙍𝙏</h1>
      </div>

      <div className="nav-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search for Products, Brand and more..."
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="cart-icon">
        <img className="cart" src={cartimg} alt="cart" />
      </div>
      <div className="nav-links">
        {token ? (
          <>
            <div className="dropdown">
            <button className="profile-icon"></button>
              {/* <button className="dropdown-btn">MY PROFILE</button> */}
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </>
        ) : (
          <Link to="/login">
            <button className="log">
            Login</button>
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
