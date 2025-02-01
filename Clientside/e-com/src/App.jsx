import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useState } from "react"

import Home from "./components/Home"
import Login from "./components/Login"
import Nav from './components/Nav'
import Register from "./components/Register"
import Verify from "./components/Verify"
import Profile from "./components/Profile"
import SellerPage from "./components/SellerPage"
import AddProduct from "./components/AddProduct"
import CategoryPage from "./components/CategoryPage"
import ProductDetailsPage from "./components/ProductDetailsPage"
import ResetPassword from "./components/ResetPassword"
import Cart from "./components/Cart"
import ProductDetails from "./components/ProductDetails"
import MyOrder from "./components/MyOrder"
import SellerOrder from "./components/SellerOrder"
import Details from "./components/Details"


function App() {
  const [name,setName]=useState("")

  return (
    <>
      <BrowserRouter>
      <Nav setName={setName}/>
      <Routes>
        <Route path="/" element={<Home name={name}/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/verify" element={<Verify/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/sellerPage" element={<SellerPage/>}></Route>
        <Route path="/addProduct" element={<AddProduct/>}></Route>
        <Route path="/category/:category" element={<CategoryPage/>}></Route>
        <Route path="/products/:productId" element={<ProductDetailsPage/>}></Route>
        <Route path="/product/:productId" element={<ProductDetails/>}></Route>
        <Route path="/resetPassword" element={<ResetPassword/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
        <Route path="/myOrder" element={<MyOrder/>}></Route>
        <Route path="/details/:productId" element={<Details/>}></Route>
        <Route path="/sellerOrder" element={<SellerOrder/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
