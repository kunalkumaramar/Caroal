import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  FaEye,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaShareAlt,
  FaTruck,
  FaLock,
  FaTimes,
} from "react-icons/fa";
import "../styles/components/ProductDetails.css";
import DealsOfTheMonth from "../components/DealsOfMonth";
import SpecialProduct from "../components/SpecialProduct";
import Footer from "../components/Footer";
import Header from "../components/Header";
import pay from "../assets/images/payment.png";
import { toast } from 'react-toastify';
import { useUser } from "../context/UserContext";

const ProductDetails = () => {
  const { state } = useLocation();
  const { currentUser } = useUser();
  const product = state?.product;
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const initialImage = product?.images?.[0] || product?.image;
  const [selectedImg, setSelectedImg] = useState(initialImage);
  const [viewerCount, setViewerCount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 5,
    seconds: 59,
    days: 0,
  });
  const [showSignInModal, setShowSignInModal] = useState(false);
  const imageRef = useRef(null);
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    const endTime = new Date().getTime() + 5 * 60 * 1000 + 59 * 1000;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, days: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const handleCheckout = () => {
  if (!currentUser || !currentUser.shippingAddress || !currentUser.shippingAddress.city) {
    toast.info("Please add your address to proceed.");
    navigate("/profile");
  } else {
    navigate("/checkout");
  }
  };
  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    setZoomStyle({
      transformOrigin: `${xPercent}% ${yPercent}%`,
      transform: "scale(2)",
      transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transition: "transform 0.3s ease",
    });
  };

  if (!product) return <p>Product not found.</p>;

  const images = product.images?.length > 0 ? product.images : Array(4).fill(product.image);

  const handleAddToCart = () => {
  if (!currentUser) {
    setShowSignInModal(true);
    return;
  }
  const cleanPrice = parseFloat((product.price || "0").replace(/[^0-9.]/g, ""));

  addToCart({
    id: product.id,
    name: product.name,
    price: cleanPrice,
    quantity,
    image: selectedImg,
    color: "Red",
   });
   
    if (window.innerWidth >= 768) {
      setShowCart(true);
    } else {
      toast.success("Item added to cart!", { autoClose: 2000 });
    }

  };

  const handleCloseCart = () => setShowCart(false);
  const cleanPrice = parseFloat((product.price || "0").replace(/[^0-9.]/g, ""));


  return (
    <>
      <Header />
      <div className="product-details-page fade-in1">
        <div className="left-panel">
          <div className="thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                className={`thumb-img ${selectedImg === img ? "selected" : ""}`}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </div>
          <div
            className="main-image-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              className="main-image"
              src={selectedImg}
              alt={product.name}
              ref={imageRef}
              style={zoomStyle}
            />
          </div>
        </div>

        <div className="right-panel">
          <div className="brand">CAROAL</div>
          <h1 className="product-title">{product.name}</h1>

          <div className="ratings">
            <FaStar /> <FaStar /> <FaStar /> <FaStarHalfAlt /> <FaRegStar /> (3)
          </div>

          <div className="price-section">
            <span className="current-price">{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">{product.originalPrice}</span>
                <span className="discount">Save 33%</span>
              </>
            )}
          </div>

          <p className="viewer-count">
            <FaEye /> {viewerCount} {viewerCount > 1 ? "people are" : "person is"} viewing this
          </p>

          <div className="countdown">
            Hurry up! Sale ends in:
            <div className="timer1">
              {`${String(timeLeft.days).padStart(2, '0')}d : ${String(timeLeft.hours).padStart(2, '0')}h : ${String(timeLeft.minutes).padStart(2, '0')}m : ${String(timeLeft.seconds).padStart(2, '0')}s`}
            </div>
          </div>

          <p className="stock-warning">Only 9 item(s) left in stock!</p>

          <div className="size-section">
            <p><strong>Size:</strong></p>
            {['M', 'L', 'XL', 'XXL'].map(size => (
              <button key={size} className="size-btn">{size}</button>
            ))}
          </div>

          <div className="color-section1">
            <p><strong>Color:</strong></p>
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="color-dot1"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>

          <div className="quantity-cart-section">
            <p><strong>Quantity:</strong></p>
            <div className="quantity-box">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className="add-to-cart-box" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          <div className="actions">
            <span><FaShareAlt /> Share</span>
          </div>

          <div className="delivery-info">
            <p><FaTruck /> <strong>Estimated Delivery:</strong> Jul 30 - Aug 03</p>
            <p><FaTruck /> <strong>Free Shipping & Returns:</strong> On all orders over ₹75</p>
          </div>

          <div className="secure-checkout">
            <img
              src={pay}
              alt="payment methods"
              className="payment-img"
            />
            <p className="checkout-safe"><FaLock /> Guarantee safe & secure checkout</p>
          </div>
        </div>

        {showCart && (
          <div className="mini-cart">
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <FaTimes onClick={handleCloseCart} className="close-icon" />
            </div>
            <p>Buy <strong>₹122.35</strong> more and get <strong>Free Shipping</strong></p>
            <div className="cart-item">
              <img src={selectedImg} alt="cart-product" />
              <div>
                <p>{product.name}</p>
                <p>Color: Red</p>
                <p>{product.price}</p>
              </div>
            <div className="quantity-box">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            </div>
            <div className="cart-footer">
              <p><input type="checkbox" /> For ₹10.00 Please Wrap The Product</p>
              <p><strong>Subtotal:</strong> ₹{(cleanPrice * quantity).toFixed(2)}</p>
              <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
              <button className="view-cart-btn" onClick={() => navigate('/cart')}>View Cart</button>
            </div>
          </div>
        )}
        {showSignInModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <FaTimes className="modal-close-icon" onClick={() => setShowSignInModal(false)} />
            <FaLock size={40} className="modal-alert-icon" />
            <h3>Sign In Required</h3>
            <p>Please sign in to add items to your cart.</p>
            <button className="modal-btn" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          </div>
        </div>
      )}
      </div>
      <SpecialProduct />
      <DealsOfTheMonth />
      <Footer />
    </>
  );
};

export default ProductDetails;
