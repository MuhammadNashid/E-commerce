import React, { useState } from "react";
import loginimg from "../assets/login.png"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pass: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state before submitting

    try {
      console.log(formData);

      // Sending data to the backend
      const res = await axios.post("http://localhost:3006/api/login", formData);

      console.log(res.data); // Debugging response
      if (res.status === 201) {
        // Assuming the backend sends a token and a success message
        localStorage.setItem("token", res.data.token);
        alert("Successfully logged in!");
        navigate("/"); // Redirect to the homepage or dashboard
      } else {
        // Handle other responses from the backend
        alert(res.data.msg);
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
   <div className="login-container">
       <div className="login-box">
      <div className="login-left">
        <h2 className="h2">𝗟𝗢𝗚𝗜𝗡</h2>
        <p>Get access to your Orders, Wishlist, and Recommendations</p>
        <img src={loginimg} alt=""  className="img1"/>
      </div>

        {error && <p className="error-message">{error}</p>} {/* Display error */}

        <div className="login-right">

        <form onSubmit={handleSubmit}>
        <div className="form-group">
              <input
                className="in1"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
            <input
                className="in2"
                type="password"
                name="pwd"
                value={formData.pwd}
                onChange={handleChange}
                placeholder="password"
                required
              />
             </div>
             <button type="submit" className="btn-login1" onClick={handleSubmit}> Login </button>
        </form>

        <div className="form-footer">
           <Link to={"/verifyEmail"} className="forgot-password-link">
             Forgot Password?
           </Link>
         </div>
         <div className="und">
           <Link to={"/register"} className="signup-link">
             <span className="sp">Don't have an account?</span>
             Sign Up
           </Link>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Login;