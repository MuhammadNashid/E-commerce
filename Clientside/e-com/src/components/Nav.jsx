// import React from 'react';
// import './Nav.css';

// function Navbar() {
//   return (
//     <nav className="navbar">
//       {/* Logo */}
//       <div className="logo">
//         Flipkart
//       </div>

//       {/* Search Bar */}
//       <div className="search-bar">
//         <input type="text" placeholder="Search for products, brands and more" />
//         <button>Search</button>
//       </div>

//       {/* Menu */}
//       <div className="menu">
//         <a href="#">Home</a>
//         <a href="#">Electronics</a>
//         <a href="#">Fashion</a>
//         <a href="#">Home & Furniture</a>
//         <a href="#">Toys</a>
//         <a href="#">Groceries</a>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState } from 'react';
import './Nav.css';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa'; // Profile Icon

function Navbar() {
  // State for managing the profile dropdown and category dropdown
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">Flipkart</div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search for products, brands and more" />
        <button>Search</button>
      </div>

      {/* Menu (Categories Dropdown) */}
      <div className="menu">
        <div className="dropdown">
          <a href="#" onClick={toggleCategoryDropdown}>Categories <FaCaretDown /></a>
          {isCategoryDropdownOpen && (
            <div className="dropdown-menu">
              <a href="#">Electronics</a>
              <a href="#">Fashion</a>
              <a href="#">Home & Furniture</a>
              <a href="#">Toys</a>
              <a href="#">Groceries</a>
            </div>
          )}
        </div>
      </div>

      {/* Profile and Login Section */}
      <div className="profile">
        <button className="login-btn"><a href="/Login">Login</a></button>

        {/* Profile Icon and Dropdown */}
        <div className="profile-dropdown">
          <FaUserCircle
            className="profile-icon"
            onClick={toggleProfileDropdown}
          />
          {isProfileDropdownOpen && (
            <div className="dropdown-menu profile-dropdown-menu">
              <a href="#">Profile</a>
              <a href="#">Orders</a>
              <a href="#">Wishlist</a>
              <a href="#">Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
