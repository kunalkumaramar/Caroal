import React from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/CartPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from 'react-toastify';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const handleCheckout = () => {
  if (!currentUser || !currentUser.shippingAddress || !currentUser.shippingAddress.city) {
    toast.info("Please add your address to proceed.");
    navigate("/profile");
  } else {
    navigate("/checkout");
  }
};
  return (
    <>
    <Header/>
    <div className="cart-page">
      <h2 className="cart-title">Shopping Cart</h2>
        <span className="breadcrumb2">
            <Link to="/" className="breadcrumb-link">Home</Link> &gt; Shopping Cart
        </span>
      <div className="cart-table-header">
        <span>Product</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item, i) => (
              <div className="cart-row" key={i}>
                <div className="product-info">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="product-name">{item.name}</p>
                    <p className="product-color">Color: {item.color}</p>
                    <button
                      className="remove-link"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <span>₹{item.price.toFixed(2)}</span>

                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>

                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="cart-summary-container">
            <div className="coupon-section">
              <input type="text" placeholder="COUPON CODE" />
              <button className="coupon-btn">View Offers</button>
              <label className="gift-wrap">
                <input type="checkbox" /> For ₹10.00 Please Wrap The Product
              </label>
            </div>

            <div className="cart-summary">
              <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
              <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;
