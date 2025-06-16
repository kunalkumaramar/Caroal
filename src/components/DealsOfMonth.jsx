import React, { useState, useEffect, useRef } from "react";
import "../styles/components/DealsOfMonth.css";
import { motion, AnimatePresence } from "framer-motion";
import dress1 from "../assets/images/deal-men-black-dress.jpg";
import dress2 from "../assets/images/deal-men-white-dress.jpg";
import dress3 from "../assets/images/deal-men-black-goggles.jpg";

const deals = [
  { id: 1, title: "Spring Sale", discount: "30% OFF", image: dress1 },
  { id: 2, title: "Summer Breeze", discount: "25% OFF", image: dress2 },
  { id: 3, title: "Holiday Special", discount: "40% OFF", image: dress3 },
];

const DealsOfTheMonth = () => {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [headerText, setHeaderText] = useState('');
  const fullHeader = "Deals Of The Month";

  const next = () => setIndex((prev) => (prev + 1) % deals.length);
  const prev = () => setIndex((prev) => (prev - 1 + deals.length) % deals.length);

  const intervalRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const targetDate = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let idx = 0;
    const typing = setInterval(() => {
      setHeaderText(fullHeader.slice(0, idx + 1));
      idx++;
      if (idx === fullHeader.length) clearInterval(typing);
    }, 150);
    return () => clearInterval(typing);
  }, []);
   useEffect(() => {
    const startAutoScroll = () => {
      intervalRef.current = setInterval(() => {
        next();
      }, 10000); // 10 seconds
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    startAutoScroll();

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoScroll);
      carousel.addEventListener("mouseleave", startAutoScroll);
    }

    return () => {
      stopAutoScroll();
      if (carousel) {
        carousel.removeEventListener("mouseenter", stopAutoScroll);
        carousel.removeEventListener("mouseleave", startAutoScroll);
      }
    };
  }, []);

  const renderFlipUnit = (num, label) => (
    <div className="flip-unit">
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">{String(num).padStart(2, '0')}</div>
          <div className="flip-card-back">{String(num).padStart(2, '0')}</div>
        </div>
      </div>
      <p className="pt">{label}</p>
    </div>
  );

  return (
    <section className="deals-section">
      <div className="deal-text">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {headerText}
        </motion.h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis ultrices sollicitudin aliquam sem. Scelerisque duis ultrices sollicitudin </p>
        <button>Buy Now</button>
        <h3>Hurry, Before It’s Too Late!</h3>
        <div className="timer">
          {renderFlipUnit(timeLeft.days, "Days")}
          {renderFlipUnit(timeLeft.hours, "Hr")}
          {renderFlipUnit(timeLeft.minutes, "Min")}
          {renderFlipUnit(timeLeft.seconds, "Sec")}
        </div>
      </div>

      <div className="deal-carousel">
        <button className="arrow1 left1" onClick={prev}>‹</button>
        <AnimatePresence mode="wait">
          <motion.div
            key={deals[index].id}
            className="deal-item"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <img src={deals[index].image} alt={deals[index].title} />
            <div className="deal-info">
              <p>0{deals[index].id} — {deals[index].title}</p>
              <strong>{deals[index].discount}</strong>
            </div>
          </motion.div>
        </AnimatePresence>
        <button className="arrow1 right1" onClick={next}>›</button>
      </div>
    </section>
  );
};

export default DealsOfTheMonth;
