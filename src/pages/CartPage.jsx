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
  const [openPolicy, setOpenPolicy] = useState(null);
  const { items: cartItems, totals, loading } = useSelector((state) => state.cart);
  const { appliedCoupon } = useSelector((state) => state.discount);
  const user = useSelector((state) => state.auth.user);

  const [couponCode, setCouponCode] = useState("");
  const togglePolicy = (type) => {
    setOpenPolicy(openPolicy === type ? null : type);
  };
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
        <div className="policy-container">
  {/* Shipping Policy */}
  <div className="policy-section">
    <button className="policy-header" onClick={() => togglePolicy('shipping')}>
      Shipping Policy 
    </button>
    {openPolicy === 'shipping' && (
      <div className="policy-content">
         <p><strong>At Caroal,</strong> we strive to deliver your order as quickly and efficiently as possible. Please read our shipping policy to understand how we process and deliver your purchases.</p>

      <p><strong>1. Order Processing Time</strong></p>
      <ul>
        <li>All orders are processed within 2–5 business days (excluding Sundays and public holidays).</li>
        <li>Orders placed after 5:00 PM will be processed the next business day.</li>
        <li>During peak seasons or promotions, order processing may take slightly longer.</li>
      </ul>

      <p><strong>2. Shipping Charges</strong></p>
      <ul>
        <li>Shipping charges (if any) will be calculated and displayed at checkout.</li>
        <li>We may offer free shipping on selected products or during special campaigns — please check our homepage or product details for offers.</li>
      </ul>

      <p><strong>3. Delivery Timelines</strong></p>
      <ul>
        <li>After dispatch, delivery typically takes 4–8 business days depending on your location.</li>
        <li>Remote or non-metro areas may take a bit longer.</li>
        <li>You will receive tracking details via SMS/email once your order is shipped.</li>
      </ul>

      <p><strong>4. Courier Partners</strong></p>
      <ul>
        <li>We work with trusted courier partners to ensure safe and timely delivery across India.</li>
        <li>Once shipped, we are not responsible for courier delays caused by unforeseen circumstances (weather, strikes, natural calamities, etc.).</li>
      </ul>

      <p><strong>5. Address & Delivery Issues</strong></p>
      <ul>
        <li>Please ensure that your shipping address and contact details are accurate at the time of placing the order.</li>
        <li>If the courier service fails to deliver due to incorrect or incomplete address, re-shipping (if requested) will be chargeable.</li>
      </ul>

      <p><strong>6. Damaged or Lost Shipments</strong></p>
      <ul>
        <li>If your order arrives visibly damaged, please take photos of the packaging and product, and contact us within 24 hours.</li>
        <li>In rare cases of lost shipments, we will coordinate with the courier and provide a resolution (replacement or refund) based on investigation.</li>
      </ul>

      <p><strong>7. Shipping Locations</strong></p>
      <ul>
        <li>We currently ship across all serviceable pincodes in India.</li>
        <li>We do not offer international shipping currently.</li>
      </ul>

      <p><strong>Contact Us</strong></p>
      <p>
        📧 Email: <a>caroal.official06@gmail.com</a><br />
        📞 Phone: <a>+91 94030 17521</a>
      </p>
      </div>
    )}
  </div>

  {/* Terms and Conditions */}
  <div className="policy-section">
    <button className="policy-header" onClick={() => togglePolicy('terms')}>
      Terms and Conditions
    </button>
    {openPolicy === 'terms' && (
      <div className="policy-content">
        <p><strong>Welcome to Caroal,</strong> a brand operated by Parshwa Apparels. By accessing or using our website (<a href="https://www.caroal.com" target="_blank" rel="noopener noreferrer">www.caroal.com</a>), you agree to be bound by the following Terms and Conditions.</p>

      <p><strong>1. General</strong></p>
      <ul>
        <li>The website and its contents are owned and operated by Parshwa Apparels, registered in India.</li>
        <li>The terms "we", "our", and "us" refer to Caroal/Parshwa Apparels.</li>
        <li>You must be 18+ or using the site under a guardian’s supervision.</li>
      </ul>

      <p><strong>2. Products and Orders</strong></p>
      <ul>
        <li>Product availability is subject to change.</li>
        <li>We reserve the right to limit quantities.</li>
        <li>Colors/images may vary based on your screen.</li>
        <li>Orders are confirmed only after payment and email/SMS confirmation.</li>
      </ul>

      <p><strong>3. Pricing and Payments</strong></p>
      <ul>
        <li>All prices are in INR and include taxes.</li>
        <li>Payments accepted via cards, UPI, wallets, and net banking.</li>
        <li>Prices may change without notice.</li>
      </ul>

      <p><strong>4. Shipping and Delivery</strong></p>
      <ul>
        <li>Orders process in 2–5 business days.</li>
        <li>Delivery time depends on location and courier.</li>
        <li>Shipping charges shown during checkout.</li>
      </ul>

      <p><strong>5. Returns and Refunds</strong></p>
      <ul>
        <li>Only damaged/defective items can be returned (request within 3 days).</li>
        <li>Returned products must be unused and in original packaging.</li>
        <li>Refunds are processed in 7–10 business days.</li>
        <li>See full Return & Refund Policy for more details.</li>
      </ul>

      <p><strong>6. Cancellations</strong></p>
      <ul>
        <li>Orders can be cancelled within 12 hours unless already shipped.</li>
      </ul>

      <p><strong>7. Privacy Policy</strong></p>
      <ul>
        <li>Your data is secure with us. See our Privacy Policy for full details.</li>
      </ul>

      <p><strong>8. Limitation of Liability</strong></p>
      <ul>
        <li>We are not liable for indirect or consequential damages arising from your use of our services.</li>
      </ul>

      <p><strong>9. Governing Law and Jurisdiction</strong></p>
      <ul>
        <li>These terms are governed by Indian law under Mumbai courts' jurisdiction.</li>
      </ul>

      <p><strong>10. Changes to Terms</strong></p>
      <ul>
        <li>We may update these Terms at any time without notice. Please check this page regularly.</li>
      </ul>

      <p><strong>Contact Information</strong></p>
      <p>
        📧 Email: <a>caroal.official06@gmail.com</a><br />
        📞 Phone: <a>+91 94030 17521</a><br />
        🏢 Address: B-Building, 2nd Floor, Gala No. 203, JMD Complex, Sony Bai Compound, Near Munisurat Phase 2, Opp. Manibadra Era Gate, Anjurphata, Bhiwandi, Maharashtra – 421302.
      </p>
      </div>
    )}
  </div>

  {/* Return and Refund Policy */}
  <div className="policy-section">
    <button className="policy-header" onClick={() => togglePolicy('refund')}>
      Return and Refund Policy 
    </button>
    {openPolicy === 'refund' && (
      <div className="policy-content">
        <p>At Caroal, we take pride in delivering quality menswear and ensuring customer satisfaction. However, if for any reason you're not entirely satisfied with your purchase, we’re here to help.</p>

      <p><strong>1. Return Eligibility</strong></p>
      <ul>
        <li>Returns accepted only if the item is damaged, defective, or incorrect.</li>
        <li>Return request must be made within 3 days of delivery.</li>
        <li>Product must be unused, unwashed, and in original packaging with tags intact.</li>
      </ul>

      <p><strong>2. Non-Returnable Items</strong></p>
      <ul>
        <li>Products damaged by customer misuse.</li>
        <li>Worn, washed, or altered items.</li>
        <li>Final sale or clearance items.</li>
      </ul>

      <p><strong>3. Return Process</strong></p>
      <ol>
        <li>Contact us via email at <a>caroal.official06@gmail.com</a> or call <a>+91 94030 17521</a> within 3 days of delivery.</li>
        <li>Share order number, issue description, and photos if applicable.</li>
        <li>Our team will respond within 24–48 hours and guide you through the return process.</li>
      </ol>
      <p>Note: Return shipping is borne by the customer unless the item is defective or incorrect.</p>

      <p><strong>4. Refunds</strong></p>
      <ul>
        <li>Refunds issued once the returned item is received and inspected.</li>
        <li>If approved, refund is processed to original payment method in 7–10 business days.</li>
        <li>Shipping charges are non-refundable unless the return is due to our error.</li>
      </ul>

      <p><strong>5. Exchanges</strong></p>
      <ul>
        <li>We do not offer exchanges. Please return and reorder if needed.</li>
      </ul>

      <p><strong>6. Late or Missing Refunds</strong></p>
      <ul>
        <li>Check your bank account.</li>
        <li>Contact your payment provider.</li>
        <li>Still no refund? Email us at <a>caroal.official06@gmail.com</a>.</li>
      </ul>

      <p><strong>Contact Us</strong><br />
        📧 Email: <a>caroal.official06@gmail.com</a><br />
        📞 Phone: <a>+91 94030 17521</a>
      </p>
      </div>
    )}
  </div>
</div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
