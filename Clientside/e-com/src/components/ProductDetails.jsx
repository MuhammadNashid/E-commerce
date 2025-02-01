import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Pdetails.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/getProduct/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setProduct(res.data.product);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId, token]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-details-page">
      <div className="product-container">
        {/* Left Section: Images */}
        <div className="image-section">
          <img src={product.thumbnail} alt={product.name} className="main-image" />
          <div className="thumbnail-section">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>

        {/* Right Section: Product Details */}
        <div className="details-section">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-quantity">Available Quantity: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;