import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import "./PPdetails.css";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

    const checkProductInCart = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/findOnCart/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 201 && res.data.cart) {
          setIsInCart(true);
        }
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    const checkIfFavorite = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/checkWishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200 && res.data.isFavorite) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error checking wishlist:", error);
      }
    };

    fetchProductDetails();
    checkProductInCart();
    checkIfFavorite();
  }, [productId, token]);

  const handleAddToCart = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/addCart`,
        { productID: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        alert("Added to cart Successfully");
        setIsInCart(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="product-details-page">
      <div className="product-container">
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

        <div className="details-section">
          <h2 className="product-name">{product.name}</h2>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-quantity">Available Quantity: {product.quantity}</p>

          <div className="button-group">
            {isInCart ? (
              <button className="add-to-cart-button" onClick={() => navigate("/cart")}>
                Go to Cart
              </button>
            ) : (
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )}
            {/* <button className="buy-now-button">Buy Now</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;