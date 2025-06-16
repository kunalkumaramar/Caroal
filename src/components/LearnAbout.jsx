// components/LearnAbout.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/LearnAbout.css';
import leftModel from '../assets/images/left-model.png';  // Replace with your image
import rightModel from '../assets/images/right-model.png'; // Replace with your image

const LearnAbout = () => {
  return (
    <section className="learn-about">
      <img src={leftModel} alt="Left Model" className="model-image left" />
      
      <div className="about-content">
        <h2>Learn About Us</h2>
        <p>We are Caroal.<br />
        Not just a brand — a statement.<br />
        A celebration of contrast; simplicity, and timeless design.</p>

        <p>In a world bursting with noise and colors, we chose the silence of black and white. Why?<br />
        Because style doesn’t need to be loud.<br />
        It needs to speak clearly.</p>

        <p>Our journey began with a simple question:<br />
        What if fashion could be bold without being loud?<br />
        That question became our mission<br />
        to craft everyday essentials that are effortlessly<br />
        stylish, confidently minimal, and universally versatile.</p>

        <p>We believe fashion isn’t about trends.<br />
        It’s about identity. Intention. And impact.</p>

        <p>Welcome to Caroal.<br />
        Where contrast isn’t just in color — it’s in attitude.</p>
        
        <Link to="/collaboration">
          <button className="collab-button">Click for Collaboration</button>
        </Link>
      </div>

      <img src={rightModel} alt="Right Model" className="model-image right" />
    </section>
  );
};

export default LearnAbout;
