import React from 'react';
import '../styles/components/HeroSection.css';
import modelLeft from '../assets/images/hero-man-left.png'; 
import modelRight from '../assets/images/hero-man-right.png'; 
import bannerImage from '../assets/images/banner-two-men.png';
import modelTop from '../assets/images/hero-men-group.png';
import { FaShoppingCart, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/UserContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const handleShopNow = () => {
    currentUser ? navigate("/products") : navigate("/signin");
  };

  return (
    <section className="hero-section">
      {/* Left Image */}
      <div className="hero-image-box left1 slide-in">
        <img src={modelLeft} alt="Model Left" className="hero-image" />
      </div>

      {/* Center Banner */}
      <div className="hero-center-banner">
        <div className="banner-top-images slide-in-top">
          <img src={modelTop} alt="Top Banner" className="top-banner-image" />
        </div>
        <h2 className="ultimate-text">ULTIMATE</h2>
        <h1 className="sale-text">SALE</h1>
        <p className="collection-text">NEW COLLECTION</p>
        <button onClick={handleShopNow} className="shop-now-btn">SHOP NOW</button>
        <div className="banner-bottom-images slide-in-bottom">
          <img src={bannerImage} alt="Bottom Banner" className="bottom-banner-img" />
        </div>
      </div>

      {/* Right Image */}
      <div className="hero-image-box1 right slide-in">
        <img src={modelRight} alt="Model Right" className="hero-image" />
      </div>

      {/* Floating icons (only for desktop) */}
      <div className="floating-icons hide-on-mobile">
        <button className="icon-btn cart-btn" onClick={handleShopNow}>
          <FaShoppingCart color="white" size={20} />
        </button>
        <button
          className="icon-btn scroll-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <FaArrowUp size={20} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
