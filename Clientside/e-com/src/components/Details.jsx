import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "./details.css";

const Details = () => {
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
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
    checkIfFavorite();
  }, [productId, token]);

  const toggleFavorite = async () => {
    try {
      const url = isFavorite ? `removeFromWishlist` : `addToWishlist`;

      const res = await axios.post(`http://localhost:3000/api/${url}/${productId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      
      if (res.status === 200) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="prod">
      <div className="produ">
        <div className="wishlist-container">
          {/* Wishlist Icon */}
          <button 
            className="wish-icon" 
            onClick={toggleFavorite}
          >
            {isFavorite ? <AiFillHeart size={28} color="red" /> : <AiOutlineHeart size={28} color="#333" />}
          </button>
        </div>
        
        <Link to={`/products/${product._id}`} key={product._id} className="proit">
          <div className="imagese">
            <img src={product.thumbnail} alt={product.name} className="maiim" />
            <div className="thumbnail-section"></div>
          </div>
        </Link>


        <div className="dsec">
          <p className="pname">{product.name}</p>
          <p className="ppric">₹{product.price}</p>
          <p className="pcat">Category: {product.category}</p>
          <p className="pcat">Description: {product.description}</p>
          <p className="pcat">Available Quantity: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;
