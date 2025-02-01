import React, { useState, useEffect } from "react";
import "./ProfileInfo.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    accType: "",
  });
  const [address, setAddress] = useState({
    city: "",
    pincode: "",
    district: "",
    country: "",
  });
  const [userAddresses, setUserAddresses] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/getuserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          const user = res.data.usr;
          setUserDetails(user);
          setFormData({
            username: user.username,
            email: user.email,
            phone: user.phone,
            accType: user.accType,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) fetchUserDetails();
  }, [token]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/getuseraddress", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setUserAddresses(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (token) fetchUserAddresses();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddressChange = (e) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:3000/api/updateUser", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        setUserDetails((prev) => ({ ...prev, ...formData }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/addAddress", address, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 201) {
        alert("Address added successfully!");
        setShowAddressFields(false);
        setAddress({ city: "", pincode: "", district: "", country: "" });
        setUserAddresses((prev) => [...prev, res.data.data]);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <div className="profile-container">
    <div className="profile-card">
    {userDetails?.accType === "seller" && (
        <button className="seller-btn" onClick={() => navigate("/sellerPage")}>
          Seller Page
        </button>
      )}

        <h2 className="profile-title">Profile Details</h2>
        <div className="profile-fields">
          {Object.entries(formData).map(([key, value]) => (
            <div className="profile-field" key={key}>
              <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          ))}
        </div>
        {!isEditing ? (
          <button className="edit-btn1" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        ) : (
          <div className="action-buttons">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="address-container">
      <div className="address21">
        <h2 className="address-title">Your Addresses</h2>
        {userAddresses.length > 0 ? (
          userAddresses.map((addr, index) => (
            <div className="address-card" key={index}>
              <p><strong>City:</strong> {addr.city}</p>
              <p><strong>Pincode:</strong> {addr.pincode}</p>
              <p><strong>District:</strong> {addr.district}</p>
              <p><strong>Country:</strong> {addr.country}</p>
            </div>
          ))
        ) : (
          <p className="no-address">No addresses available.</p>
        )}

        {!showAddressFields ? (
          <button className="add-address-btn" onClick={() => setShowAddressFields(true)}>
            +
          </button>
        ) : (
          <div className="new-address-form">
            {Object.keys(address).map((key) => (
              <div className="profile-field" key={key}>
                <span className="label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                <input type="text" name={key} value={address[key]} onChange={handleAddressChange} />
              </div>
            ))}
            <button className="save-btn" onClick={handleAddAddress}>Save Address</button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProfileInfo;