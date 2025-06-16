import React from 'react';
import '../styles/components/Footer.css'; // Create and style this separately

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo">CAROAL</div>
        <div className="footer-links">
          <a href="#">Support Center</a>
          <a href="#">Invoicing</a>
          <a href="#">Contract</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">FAQs</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright © 2022 CAROAL. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
