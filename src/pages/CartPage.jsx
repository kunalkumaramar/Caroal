import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeCartItem,
  updateCartItem
} from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/components/CartPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: cartItems, totals, loading } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
    if (!user || !user.shippingAddress || !user.shippingAddress.city) {
      toast.info("Please add your address to proceed.");
      navigate("/profile");
    } else {
      navigate("/checkout");
    }
  };

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

                  {/* 👇 Use item's backend-calculated total if available */}
                  <span>₹{item.total?.toFixed(2) || "0.00"}</span>
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
                {/* 👇 Use backend-calculated subtotal */}
                <p><strong>Subtotal:</strong> ₹{totals?.subtotal?.toFixed(2) || "0.00"}</p>
                <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
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
