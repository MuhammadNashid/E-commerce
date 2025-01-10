import React, { useState, useEffect } from "react";
import { Link,useParams } from "react-router-dom";
import axios from "axios";
import "./details.css"

const Details = () => {
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/getProduct/${productId}`, {
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
    <div className="pdetails">
      <div className="pcontainer">
        {/* Left Section: Images */}
        <Link to={`/products/${product._id}`} key={product._id} className="proit">
        <div className="img-section">
          <img src={product.thumbnail} alt={product.name} className="main-img" />
          <div className="thumbnail-section">
          </div>
        </div></Link>

        {/* Right Section: Product Details */}
        <div className="dsection">
          <h3 className="pname">{product.name}</h3>
          <p className="pcategory">Category: {product.category}</p>
          <p className="pprice">₹{product.price}</p>
          <p className="pcategory">{product.description}</p>
          <p className="pcategory">Available Quantity: {product.quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;