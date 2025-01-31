
import React, { useState } from 'react';
import axios from 'axios';
import "./Register.css"

import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    accType: 'buyer',
    pwd: '',
    cpwd: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pwdCriteria, setPwdCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    setPwdCriteria({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });

    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&]/.test(password)
    );
  };

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]: e.target.value,});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check if the account type has been changed
    if (formData.accType === 'nil') {
      alert('Please select a valid account type.');
      return;
    }

    if (!validatePassword(formData.pwd)) {
      setError(
        "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (formData.pwd !== formData.cpwd) {
      setError("Passwords do not match.");
      return;
    }


    try {
      const response = await axios.post('http://localhost:3000/api/adduser', formData);

      // Handle success
      if (response.status === 201) {
        setSuccess('Registration successful!');
        setError('');
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="register-page">
     <div className="register-container">
        {/* Left Side */}
        <div className="left-sider">
            <h1 className="h1s">Sign Up</h1>
            <p className='sigp'>Sign up with your personal details to get started</p>
            
        </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="right-sider">
      <form onSubmit={handleSubmit}>
      <div className="forms-group">
              <input
              className="in2"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="forms-group">
              <input
                className="in2"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>

            <div className="forms-group">
              <input
                className="in2"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>

            <div className="forms-group">
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


            <div className="forms-group">
              <input
                className="in2"
                type="password"
                name="cpwd"
                value={formData.cpwd}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className="forms-group">
              <select
                name="accType"
                value={formData.accType}
                onChange={handleChange}
                required
              >
                <option value="nil" >
                  Select Account Type
                </option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

           
            <div className="con2">
              By signing up, you agree to our{" "}
              <span className="le2"> Terms , Privacy Policy</span> and{" "}
              <span className="le2"> Cookies Policy .</span>
            </div>
            <button type="submit" className="btn-submit">
              Sign up
            </button>
      </form>
    </div>
    </div>
    </div>
  );
};

export default Register;