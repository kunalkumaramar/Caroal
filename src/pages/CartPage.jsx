import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeCartItem,
  updateCartItem
} from "../redux/cartSlice";
import { applyCoupon, clearAppliedCoupon } from "../redux/discountSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/CartPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, totals, loading } = useSelector((state) => state.cart);
  const { appliedCoupon } = useSelector((state) => state.discount);
  const user = useSelector((state) => state.auth.user);

  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  useEffect(() => {
  if (cartItems.length === 0 && appliedCoupon) {
    dispatch(clearAppliedCoupon());
  }
}, [cartItems, appliedCoupon, dispatch]);

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ itemId, updatedData: { quantity: newQty } }))
      .unwrap()
      .then(() => dispatch(fetchCart()));
  };

  const handleRemove = (itemId) => {
    dispatch(removeCartItem(itemId))
      .unwrap()
      .then(() => dispatch(fetchCart()));
  };

  const handleCheckout = () => {
  if (!user || !user.addresses || user.addresses.length === 0 || !user.addresses[0].city) {
    toast.info("Please add your address to proceed.");
    navigate("/profile");
  } else {
    navigate("/checkout");
  }
};

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      dispatch(applyCoupon(couponCode.trim()));
    }
  };

  // Coupon Discount Calculation
  const subtotal = cartItems.reduce((acc, item) => {
  const price = item.product?.price || 0;
  const qty = item.quantity || 0;
  return acc + price * qty;
  }, 0);
  let discountAmount = 0;

  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      if (subtotal >= appliedCoupon.minPurchase) {
        discountAmount = (appliedCoupon.value / 100) * subtotal;
      }
    } else if (appliedCoupon.discountType === "buyXgetY") {
      const applicableItems = cartItems.filter((item) =>
        appliedCoupon.applicableCategories.includes(item.product?.categoryId)
      );

      let applicableQty = 0;
      applicableItems.forEach((item) => {
        applicableQty += item.quantity;
      });

      const freeItems = Math.floor(applicableQty / (appliedCoupon.buyX + appliedCoupon.getY)) * appliedCoupon.getY;
      const itemPrice = applicableItems[0]?.product?.price || 0;
      discountAmount = freeItems * itemPrice;
    }
  }

 const shippingCharge = 10;
 const taxableAmount = subtotal - discountAmount + shippingCharge;
 const taxAmount = Math.round(0.18 * taxableAmount);
 const finalTotal = parseFloat((taxableAmount + taxAmount).toFixed(2));


  return (
    <>
      <Header />
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

        {loading ? (
          <p className="empty-cart">Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, i) => (
                <div className="cart-row" key={i}>
                  <div className="product-info">
                    <img src={item.product?.images?.[0]} alt={item.product?.name} />
                    <div>
                      <p className="product-name">{item.product?.name}</p>
                      <button
                        className="remove-link"
                        onClick={() => handleRemove(item._id || item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <span>₹{item.product?.price?.toFixed(2)}</span>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id || item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id || item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <span>₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="cart-summary-container">
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="COUPON CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className="coupon-btn" onClick={handleApplyCoupon}>
                  Apply Coupon
                </button>

                {appliedCoupon && (
                  <p className="success-message">
                    {appliedCoupon.code} applied —{" "}
                    {appliedCoupon.discountType === "percentage"
                      ? `${appliedCoupon.value}% OFF`
                      : `Buy ${appliedCoupon.buyX} Get ${appliedCoupon.getY} FREE`}
                  </p>
                )}
              </div>

              <div className="cart-summary">
                <p><strong>Items Total:</strong> ₹{subtotal.toFixed(2)}</p>

                 {discountAmount > 0 && (
                   <p><strong>Discount:</strong> -₹{discountAmount.toFixed(2)}</p>
                 )}

                 <p><strong>Shipping Charges:</strong> ₹{shippingCharge.toFixed(2)}</p>
                 <p><strong>GST (18%):</strong> ₹{taxAmount.toFixed(2)}</p>

                 <hr />

                 <p><strong>Subtotal (Payable):</strong> ₹{finalTotal.toFixed(2)}</p>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
