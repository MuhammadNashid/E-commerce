import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError("Both fields are required");
    } else {
      setError("");
      // Handle login logic here
      console.log("Logged in", { email, password });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
          <div className="footer">
            <a href="/forgot-password">Forgot Password?</a>
            <p>
              New to Flipkart? <a href="/signup">Create an Account</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;