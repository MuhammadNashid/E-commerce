import React, { useState } from "react";
import axios from "axios";
 import "./AddProduct.css"
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate=useNavigate()
    const token=localStorage.getItem('token')
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    thumbnail: "",
    images: [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

  // Convert images to base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input for thumbnail
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        thumbnail: base64,
      }));
      setThumbnailPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  // Handle file input for product images
  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(convertBase64));
    setFormData((prevData) => ({
      ...prevData,
      images: base64Images,
    }));
    setImagesPreview(files.map((file) => URL.createObjectURL(file))); // Preview images
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    

    try {
      const res = await axios.post(
        "http://localhost:3006/api/addProduct",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        alert("Product added successfully!");
        navigate('/sellerPage')
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="addpr-con">
      <div className="prodm">
      <h2 className="titl">Add Product</h2>
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-field">
          <label className="lab" htmlFor="name">Product Name:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="inp"
          />
        </div>

        <div className="forms-field">
          <label className="lab1" htmlFor="category">Category:</label><br />
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="inp1"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Electronics">Electronics</option>
            <option value="Mobiles">Mobiles</option>
            <option value="Laptops">Laptops</option>
            <option value="Watches">Watches</option>
            <option value="Accessories">Accessories</option>
            <option value="Speakers" >Speakers</option>
            <option value="Camera">Camera</option>
            <option value="Tablets">Tablets</option>
          </select>
        </div>

        <div className="for">
          <label className="lab2" htmlFor="price">Price (₹):</label><br />
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="inp2"
          />
        </div>

        <div className="form1">
          <label className="lab3" htmlFor="description">Description:</label><br />
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="inp3"
          />
        </div>

        <div className="fofi">
          <label className="lab4" htmlFor="quantity">Quantity:</label><br />
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="inp4"
          />
        </div>

        <div className="field">
    <div className="fthum">
          <label className="lab5" htmlFor="thumbnail">Thumbnail Image:</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            className="inp5"
          />
          {thumbnailPreview && (
            <div className="imgthum">
              <img src={thumbnailPreview} alt="Thumbnail Preview" />
            </div>
          )}
  </div>
        </div>

        <div className="field">
          <div className="fprim">
          <label className="lab6" htmlFor="images">Product Images:</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            required
            className="inp6"
          />
          {imagesPreview.length > 0 && (
            <div className="imgpre">
              {imagesPreview.map((img, index) => (
                <div key={index} className="image-preview">
                  <img src={img} alt={`Product Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
          </div>
        </div>

        <div className="actions">
          <button type="submit" className="subtn">
            Add Product
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddProduct;