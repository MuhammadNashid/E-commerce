import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SellerPage.css"

const SellerPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [companyDetails, setCompanyDetails] = useState(null);
  const [formData, setFormData] = useState({
    companyName: "",
    place: "",
    pincode: "",
    district: "",
    state: "",
    country: "",
  });
  const [isAdding, setIsAdding] = useState(false); // Control the state of adding company details
  const [productCounts, setProductCounts] = useState({}); // State to hold product counts

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/getCompany", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setCompanyDetails(res.data.company);
          setFormData({
            companyName: res.data.company.companyName,
            place: res.data.company.place,
            pincode: res.data.company.pincode,
            district: res.data.company.district,
            state: res.data.company.state,
            country: res.data.company.country,
          });
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    const fetchProductCounts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/getProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          const products = res.data.products;
          const counts = products.reduce((acc, product) => {
            const category = product.category; // Adjust this based on your product schema
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});

          setProductCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCompanyDetails();
    fetchProductCounts();
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle save functionality (adding company)
  const handleSave = async () => {
    try {
      // Add company details
      const res = await axios.post(
        "http://localhost:3001/api/addCompany",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        alert("Company details added successfully!");
        setCompanyDetails(res.data.company);
        setIsAdding(false); // Hide the form after adding
      }
    } catch (error) {
      console.error("Error saving company details:", error);
    }
  };

  // Handle the click on "Add Company" button
  const handleAddCompany = () => {
    setIsAdding(true); // Show form to add company details
    setFormData({
      companyName: "",
      place: "",
      pincode: "",
      district: "",
      state: "",
      country: "",
    });
  };

  return (
    <div className="page-container">
      {/* Left Section: Company Details */}
      <div className="left-section">
        <h2 className="h2c">Company Details</h2>
        {companyDetails ? (
          // If company details exist, show them in read-only mode
          <div>
            <p className="com"><strong>Company Name:</strong> {companyDetails.companyName}</p>
            <p className="com"><strong>Place:</strong> {companyDetails.place}</p>
            <p className="com"><strong>Pincode:</strong> {companyDetails.pincode}</p>
            <p className="com"><strong>District:</strong> {companyDetails.district}</p>
            <p className="com"><strong>State:</strong> {companyDetails.state}</p>
            <p className="com"><strong>Country:</strong> {companyDetails.country}</p>
          </div>
        ) : isAdding ? (
          // When adding a company, show the form with input fields
          <form className="company-form">
            <div className="form-field">
              <label  htmlFor="company-name">Company Name:</label>
              <input
                type="text"
                id="company-name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                 className="lbl"
              />
            </div>
            <div className="form-field">
              <label htmlFor="place">Place:</label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                 className="lbl"
              />
            </div>
            <div className="form-field">
              <label  htmlFor="pincode">Pincode:</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="lbl"
              />
            </div>
            <div className="form-field">
              <label  htmlFor="district">District:</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="lbl"
              />
            </div>
            <div className="form-field">
              <label htmlFor="state">State:</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                 className="lbl"
              />
            </div>
            <div className="form-field">
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                 className="lbl"
              />
            </div>
            <div className="form-actions">
              <button className="addb" type="button" onClick={handleSave}>
                Add
              </button>
              <button
              className="canb"
                type="button"
                onClick={() => {
                  setIsAdding(false); // Close the form without saving
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // If no company details are found, show the "Add Company Details" button
          <div>
            {/* <p>No company details found.</p> */}
            <button className="seab" onClick={handleAddCompany}>Add Company Details</button>
          </div>
        )}
      </div>

      {/* Right Section: Products and Add Button */}
      <div className="right-section">
        <h2 className="ph2">Products</h2>
        <div className="pgrid">
          {Object.keys(productCounts).map((category, index) => (
            <div
              key={index}
              className="product-box"
              onClick={() => navigate(`/category/${category}`)}
            >
              {category}<sup>{productCounts[category]}</sup>
            </div>
          ))}
        </div>
        <button
          className="addpr"
          onClick={() => navigate("/addProduct")}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SellerPage;