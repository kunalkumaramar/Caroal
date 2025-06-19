import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProfile } from "./redux/authSlice";
import GoogleCallback from './pages/GoogleCallback';
import Home from "./pages/Home";
import Signin from "./pages/SignIn";
import Signup from "./pages/SignUp";
import Products from "./pages/Products";
import Collaboration from "./pages/Collaboration";
import ProductDetails from './pages/ProductDetails';
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import MainLayout from './layouts/MainLayout';
import { ToastContainer } from "react-toastify";

import "./styles/global.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchProfile());  // Refresh profile if token exists
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router basename="/Caroal">
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
          </Route>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
