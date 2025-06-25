import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FaRegUser, FaShoppingBag, FaBars, FaTimes } from "react-icons/fa";
import "../styles/components/Header.css";

const Header = () => {
  const navigate = useNavigate();
  const reduxUser = useSelector(state => state.auth.user);
  const cartItems = useSelector(state => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Sync with Redux on update
  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
    }
  }, [reduxUser]);

  return (
    <header className="header">
      <div className="logo">CAROAL</div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/" state={{ scrollTo: "deals-section" }} onClick={() => setMenuOpen(false)}>Deals</Link>
        <Link to="/" state={{ scrollTo: "newarrivals" }} onClick={() => setMenuOpen(false)}>New Arrivals</Link>
        <Link to="/products" className="nav-btn" onClick={() => setMenuOpen(false)}>Products</Link>
      </nav>

      <div className="auth-icons">
        {user ? (
          <>
            <FaRegUser className="nav-icon" onClick={() => navigate("/profile")} />
            <div className="cart-icon-wrapper" onClick={() => navigate("/cart")}>
              <FaShoppingBag className="nav-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
          </>
        ) : (
          <>
            <Link to="/signin" className="signin-link">Sign In</Link>
            <button className="signup-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
