import React, { useState, useEffect } from 'react';
import '../styles/components/TestimonialSection.css';

import img1 from '../assets/images/review1.png';
import img2 from '../assets/images/review2.png';

const reviews = [
  {
    image: img1,
    name: 'KAIVANIYA',
    role: 'Traveler',
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    stars: 5,
  },
  {
    image: img2,
    name: 'Jordan W.',
    role: 'Blogger',
    text: 'Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.',
    stars: 4,
  },
  {
    image: img1,
    name: 'Emily R.',
    role: 'Photographer',
    text: 'It fits our needs perfectly. I was amazed at the quality.',
    stars: 5,
  },
  {
    image: img2,
    name: 'Samuel T.',
    role: 'Entrepreneur',
    text: 'The customer support was excellent. I will refer everyone I know.',
    stars: 5,
  },
  {
    image: img1,
    name: 'Aanya P.',
    role: 'Designer',
    text: 'It’s just amazing. Really good. Best decision ever.',
    stars: 4,
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };
 useEffect(() => {
  const cards = document.querySelectorAll('.carousel-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view'); // optional: re-animate on scroll out/in
        }
      });
    },
    {
      threshold: 0.5, // triggers when 50% of the card is visible
    }
  );

  cards.forEach((card) => observer.observe(card));

  return () => {
    cards.forEach((card) => observer.unobserve(card));
  };
}, []);


  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="testimonial-section">
      <h2>This Is What Our Customers Say</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Scelerisque duis</p>

      <div className="carousel">
        {reviews.map((review, index) => {
          let positionClass = 'inactive';
          if (index === current) {
            positionClass = 'active';
          } else if (index === (current - 1 + reviews.length) % reviews.length) {
            positionClass = 'left';
          } else if (index === (current + 1) % reviews.length) {
            positionClass = 'right';
          }

          return (
            <div key={index} className={`carousel-card ${positionClass}`}>
              <img src={review.image} alt={review.name} className="review-img" />
              <div className="review-text">
                <p>"{review.text}"</p>
                <div className="stars">
                  {'★'.repeat(review.stars)}
                  {'☆'.repeat(5 - review.stars)}
                </div>
                <hr />
                <h4>{review.name}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="arrow-container">
        <button className="arrow left" onClick={prevSlide}>‹</button>
        <button className="arrow right" onClick={nextSlide}>›</button>
      </div>
    </div>
  );
};

export default TestimonialSection;
