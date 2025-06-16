import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/SignIn"
import Signup from "./pages/SignUp"
import Products from "./pages/Products";
import Collaboration from "./pages/Collaboration";
import "./styles/global.css";
import MainLayout from './layouts/MainLayout';
import ProductDetails from './pages/ProductDetails';
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
        </Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/collaboration" element={<Collaboration/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
