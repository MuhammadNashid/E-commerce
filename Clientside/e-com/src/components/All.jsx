// //Express.js//

// //app.js//
// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import productRoutes from './routes/productRoutes.js';
// import authRoutes from './routes/authRoutes.js';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB Connection Error", err));

// // Routes
// app.use('/api/products', productRoutes);
// app.use('/api/auth', authRoutes);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// //productsSchema//

// import mongoose from 'mongoose';

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   category: { type: String, required: true },
//   images: [{ type: String }],
//   rating: { type: Number, default: 0 },
//   stock: { type: Number, default: 0 },
// });

// const Product = mongoose.model('Product', productSchema);

// export default Product;

// //rh//

// import Product from '../models/Product.js';

// // Fetch all products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Fetch product by ID
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// //router//

// import express from 'express';
// import { getAllProducts, getProductById } from '../controllers/productController.js';

// const router = express.Router();

// router.get('/', getAllProducts);
// router.get('/:id', getProductById);

// export default router;

// import express from 'express';
// import { register, login } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// export default router;


// //userSchema//

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });

// const User = mongoose.model('User', userSchema);

// export default User;

// //rh login side//

// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // Register user
// export const register = async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 12);
//     const newUser = new User({ name, email, password: hashedPassword });
//     await newUser.save();

//     const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Login user
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// //React.js//

// // App.jsx//

// import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import ProductPage from './pages/ProductPage';
// import ProductDetailsPage from './pages/ProductDetailsPage';
// import CheckoutPage from './pages/CheckoutPage';
// import Login from './components/Login';
// import Register from './components/Register';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Switch>
//           <Route exact path="/" component={HomePage} />
//           <Route path="/products" component={ProductPage} />
//           <Route path="/product/:id" component={ProductDetailsPage} />
//           <Route path="/checkout" component={CheckoutPage} />
//           <Route path="/login" component={Login} />
//           <Route path="/register" component={Register} />
//         </Switch>
//       </div>
//     </Router>
//   );
// }

// export default App;

// //products.jsx//

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProductCard from '../components/ProductCard';

// const HomePage = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/products')
//       .then((response) => {
//         setProducts(response.data);
//       })
//       .catch((error) => console.error("Error fetching products", error));
//   }, []);

//   return (
//     <div className="home-page">
//       <h1>Featured Products</h1>
//       <div className="product-list">
//         {products.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

// //product card//

// import React from 'react';
// import { Link } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   return (
//     <div className="product-card">
//       <img src={product.images[0]} alt={product.name} />
//       <h3>{product.name}</h3>
//       <p>{product.price}</p>
//       <Link to={`/product/${product._id}`}>View Details</Link>
//     </div>
//   );
// };

// export default ProductCard;

// //pd//

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ProductDetailsPage = ({ match }) => {
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       const response = await axios.get(`http://localhost:5000/api/products/${match.params.id}`);
//       setProduct(response.data);
//     };

//     fetchProduct();
//   }, [match.params.id]);

//   return product ? (
//     <div className="product-details">
//       <img src={product.images[0]} alt={product.name} />
//       <h1>{product.name}</h1>
//       <p>{product.description}</p>
//       <h3>₹{product.price}</h3>
//     </div>
//   ) : (
//     <div>Loading...</div>
//   );
// };

// export default ProductDetailsPage;


// //cp//

// import React from 'react';

// const CheckoutPage = () => {
//   return (
//     <div className="checkout-page">
//       <h2>Checkout</h2>
//       <form>
//         <label htmlFor="address">Address</label>
//         <input type="text" id="address" name="address" required />
//         <button type="submit">Place Order</button>
//       </form>
//     </div>
//   );
// };

// export default CheckoutPage;

//oll//