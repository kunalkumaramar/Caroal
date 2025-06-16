import React from 'react';
import '../styles/components/ProductCard.css';
import { FaStar } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card fade-in-up">
      <img src={product.image} alt={product.name} />
      <div className="content">
        <div className="top-row">
          <div className="left2">
            <h3 className="product-name">{product.name}</h3>
            <div className="brand">{product.brand}</div>
            <div className="reviews">({product.reviews}k) Customer Reviews</div>
            <div className="price">₹{product.price.toFixed(2)}</div>
          </div>
          <div className="right1">
            <div className="stars">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} color="#ffc107" size={16} />
              ))}
            </div>
            <div className="status">Almost Sold Out</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
