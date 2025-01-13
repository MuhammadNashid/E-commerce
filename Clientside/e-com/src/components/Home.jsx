import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css"

const Home = ({name}) => {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchAllOtherProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3006/api/getAllOtherProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllOtherProducts();
  }, [token]);

  return (
    <div className="home-page">
      {products.length > 0 ? (
        <div className="product-grid">
          {products
          .filter((i)=>i.name?.toLowerCase().includes(name?.toLowerCase() || ""))
          .map((product) => (
            <Link to={`/details/${product._id}`} key={product._id} className="proit">
              <img src={product.thumbnail} alt={product.name} className="pthu" />
              <div className="np">
              <span className="nam">{product.name}</span>
              <span className="price">From ₹{product.price}</span></div>
            </Link>
          ))}
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Home