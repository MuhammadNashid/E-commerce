


// import React, { useState, useEffect } from "react";
// import { Link, useParams } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaRegHeart } from "react-icons/fa"; // Wishlist icons
// import "./details.css";

// const Details = () => {
//   const { productId } = useParams();
//   const token = localStorage.getItem("token");
//   const [product, setProduct] = useState(null);
//   const [isInWishlist, setIsInWishlist] = useState(false); // Track wishlist state

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const res = await axios.get(`http://localhost:3006/api/getProduct/${productId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.status === 200) {
//           setProduct(res.data.product);
//         }
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//       }
//     };

//     fetchProductDetails();
//   }, [productId, token]);

//   // Toggle wishlist state
//   const toggleWishlist = () => {
//     setIsInWishlist(prevState => !prevState);
//     // Optionally, save wishlist state to localStorage or backend
//     if (isInWishlist) {
//       localStorage.removeItem(productId); // Remove from wishlist
//     } else {
//       localStorage.setItem(productId, JSON.stringify(product)); // Add to wishlist
//     }
//   };

//   if (!product) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="prod">
//       <div className="produ">
//          {/* Wishlist Icon */}
//       <div className="wishlist-icon" onClick={toggleWishlist}>
//             {isInWishlist ? (
//               <FaHeart color="red" size={24} />
//             ) : (
//               <FaRegHeart color="gray" size={24} />
//             )}
//           </div>
//         <Link to={`/products/${product._id}`} key={product._id} className="proit">
//           <div className="imagese">
//             <img src={product.thumbnail} alt={product.name} className="maiim" />
//           </div>
//         </Link>

//         <div className="dsec">
//           <p className="pname">{product.name}</p>
//           <p className="ppric">₹{product.price}</p>
//           <p className="pcat">Category: {product.category}</p>
//           <p className="pcat">Description: {product.description}</p>
//           <p className="pcat">Available Quantity: {product.quantity}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Details;

import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Wishlist icons
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./details.css";

const Details = () => {
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false); // Track wishlist state

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3006/api/getProduct/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setProduct(res.data.product);

          // Check if the product is already in the wishlist
          const storedProduct = localStorage.getItem(productId);
          if (storedProduct) {
            setIsInWishlist(true);
          }
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details.");
      }
    };

    fetchProductDetails();
  }, [productId, token]);

  // Toggle wishlist state
  const toggleWishlist = () => {
    if (isInWishlist) {
      localStorage.removeItem(productId); // Remove from wishlist
      toast.success(`${product.name} has been removed from your wishlist.`);
    } else {
      localStorage.setItem(productId, JSON.stringify(product)); // Add to wishlist
      toast.success(`${product.name} has been added to your wishlist!`);
    }

    setIsInWishlist((prevState) => !prevState);
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="prod">
      <div className="produ">
        {/* Toastify Container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />

        {/* Wishlist Icon */}
        <div className="wishlist-icon" onClick={toggleWishlist}>
          {isInWishlist ? (
            <FaHeart color="red" size={24} />
          ) : (
            <FaRegHeart color="gray" size={24} />
          )}
        </div>
        <Link to={`/products/${product._id}`} key={product._id} className="proit">
          <div className="imagese">
            <img src={product.thumbnail} alt={product.name} className="maiim" />
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
