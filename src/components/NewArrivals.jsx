// components/NewArrivals.jsx
import React, { useEffect, useState, useRef } from 'react';
import ProductCard from './ProductCard';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import '../styles/components/NewArrivals.css';

import model1 from '../assets/models/model1.png';
import model2 from '../assets/models/model2.png';
import model3 from '../assets/models/model3.png';
import model4 from '../assets/models/model4.jpg';
import model5 from '../assets/models/model5.png';
import model6 from '../assets/models/model6.png';

gsap.registerPlugin(ScrollTrigger);

// Base product list (used for repeating on view more)
const baseProducts = [
  { image: model1, name: "Shiny Dress", brand: "Al Karam", reviews: 4.3, price: 95.50, category: "Women's Fashion" },
  { image: model2, name: "Long Dress", brand: "Luxe Fashion", reviews: 3.9, price: 120.0, category: "Women's Fashion" },
  { image: model3, name: "Full Sweater", brand: "Warm & Co.", reviews: 4.5, price: 70.0, category: "Men's Fashion" },
  { image: model4, name: "White Dress", brand: "Elegance", reviews: 4.0, price: 110.0, category: "Women's Fashion" },
  { image: model5, name: "Colorful Dress", brand: "Trendy Wear", reviews: 4.2, price: 89.0, category: "Women's Fashion" },
  { image: model6, name: "White Shirt", brand: "Classic", reviews: 3.8, price: 55.0, category: "Men's Fashion" },
];

const categories = [
  "Men's Fashion",
  "Men's T-Shirts",
  "Men's Shirts",
  "Men Accessories",
  "Discount Deals",
];

const NewArrivals = () => {
  const [items, setItems] = useState(baseProducts); // default is women's fashion = all
  const [selectedCategory, setSelectedCategory] = useState("Men's T-Shirts");
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from('.fade-in-up', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, [items]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === "Men's T-Shirts") {
      setItems(baseProducts);
    } else {
      // Random 3 products for all other categories
      const shuffled = [...baseProducts].sort(() => 0.5 - Math.random());
      setItems(shuffled.slice(0, 3));
    }
  };

  const handleViewMore = () => {
    setItems((prev) => [...prev, ...baseProducts]);
  };

  return (
    <section id="newarrivals" className="newarrival-section" ref={sectionRef}>
      <h2 className="newarrival-title">New Arrivals</h2>
      <p className="newarrival-subtext">
       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin
      </p>

      <div className="category-buttons">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => handleCategoryChange(cat)}
            className={`category-button ${cat === selectedCategory ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {items.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))}
      </div>

      <button onClick={handleViewMore} className="view-more-btn">
        View More
      </button>
    </section>
  );
};

export default NewArrivals;
