import React from "react";
import "../styles/components/PromoStrip.css";

const PromoStrip = () => {
  const items = Array(10).fill(null);

  return (
    <div className="promo-strip">
      <div className="scrolling">
        {items.map((_, i) => (
          <span key={i} className={i % 2 === 0 ? "bold" : ""}>CAROAL</span>
        ))}
      </div>
    </div>
  );
};

export default PromoStrip;
