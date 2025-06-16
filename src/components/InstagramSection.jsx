import React from 'react';
import '../styles/components/InstagramSection.css';

import img1 from '../assets/insta/insta1.png';
import img2 from '../assets/insta/insta2.jpg';
import img3 from '../assets/insta/insta3.png';
import img4 from '../assets/insta/insta4.png';
import img5 from '../assets/insta/insta5.jpg';
import img6 from '../assets/insta/insta6.png';
import img7 from '../assets/insta/insta7.png';

const Instagram = () => {
  return (
    <div className="instagram">
      <h2>Follow Us On Instagram</h2>
      <p>
        Our journey began with a simple question: What if fashion could be bold without being loud? That question became our mission — to craft everyday essentials that are effortlessly stylish, confidently minimal, and universally versatile.
      </p>
      <button className="follow-btn">Click Here To Follow</button>
      <div className="instagram-images">
        <img src={img1} alt="insta1" />
        <img src={img2} alt="insta2" />
        <img src={img3} alt="insta3" />
        <img src={img4} alt="insta4" />
        <img src={img5} alt="insta5" />
        <img src={img6} alt="insta6" />
        <img src={img7} alt="insta7" />
      </div>
    </div>
  );
};

export default Instagram;
