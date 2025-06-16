import React from 'react';
import '../styles/components/SpecialProduct.css';
import modelImage from '../assets/images/special.png'; // Replace with actual image path
import { FaRegStar, FaShippingFast} from "react-icons/fa";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { CiClock2 } from "react-icons/ci";
import bgImage from '../assets/images/bg.png'; 

const CoralSpecials = () => {
  return (
    <section className="coral-specials">
      <div className="specials-container" style={{ backgroundImage: `url(${bgImage})`,backgroundSize: '77%',backgroundRepeat: 'no-repeat',backgroundPosition: 'right'}}>
        {/* Left: Model Image and Labels */}
        <div className="model-section">
          <div className="image-container">
            <img src={modelImage} alt="Model" className="model-image1" />
            <span className="tag flat-cap">Flat Cap</span>
            <span className="tag suspenders">Suspender</span>
            <span className="tag hugo1">Hugo Boss</span>
            <span className="tag hugo2">Hugo Boss</span>
            <span className="tag santoni">Santoni</span>
          </div>
        </div>
         <div className="slant-divider"></div>

        {/* Right: Product Info */}
        <div className="info-section">
          <p className="collection-label">Men's Collection</p>
          <h2 className="product-title">Caroal Specials</h2>
          <p className="desc-title">DESCRIPTION</p>
          <p className="product-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Scelerisque duis ultrices sollicitudin aliquam sem.
            Scelerisque duis ultrices sollicitudin. Lorem ipsum dolor 
            sit amet, consectetur adipiscing elit.
          </p>

          <div className="size-price">
            <div className="size-box">
              <span className="size-label">Size:</span>
              <button className="size-button">S</button>
              <button className="size-button">M</button>
              <button className="size-button">L</button>
              <button className="size-button">XL</button>
            </div>
            <p className="price">₹1199.00</p>
          </div>

          <button className="buy-now">Buy Now</button>
        </div>
      </div>

      {/* Feature Icons */}
    <div className="feature-icons">
      {/* High Quality */}
      <div className="feature">
        <div className="icon-text-group">
          <FaRegStar className="feature-icon" />
          <div>
            <h4 className="feature-title">High Quality</h4>
            <p className="feature-text">crafted from top materials</p>
          </div>
        </div>
      </div>

      {/* Warranty Protection */}
      <div className="feature">
        <div className="icon-text-group">
          <HiOutlineCheckCircle className="feature-icon" />
          <div>
            <h4 className="feature-title">Warranty Protection</h4>
            <p className="feature-text">Over 2 years</p>
          </div>
        </div>
      </div>

      {/* Free Shipping */}
      <div className="feature">
        <div className="icon-text-group">
          <FaShippingFast className="feature-icon" />
          <div>
            <h4 className="feature-title">Free Shipping</h4>
            <p className="feature-text">Order over 150 $</p>
          </div>
        </div>
      </div>

      {/* 24/7 Support */}
      <div className="feature">
        <div className="icon-text-group">
          <CiClock2 className="feature-icon" />
          <div>
            <h4 className="feature-title">24 / 7 Support</h4>
            <p className="feature-text">Dedicated support</p>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
};

export default CoralSpecials;
