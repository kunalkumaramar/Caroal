import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/components/ProfilePage.css";
import box from "../assets/images/order.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProfilePage = () => {
  const { currentUser, logoutUser, updateShippingAddress } = useUser();
  const navigate = useNavigate();

  const [view, setView] = useState("details");
  const [address, setAddress] = useState({
    houseNumber: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    isDefault: false,
  });

  useEffect(() => {
    if (currentUser?.shippingAddress) {
      setAddress(currentUser.shippingAddress);
    }
  }, [currentUser]);

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveAddress = () => {
  const requiredFields = [
    "houseNumber",
    "postalCode",
    "addressLine1",
    "city",
    "state"
  ];

  const isEmpty = requiredFields.some((field) => !address[field]?.trim());

  if (isEmpty) {
    toast.error("Please fill in all required address fields.");
    return;
  }

  updateShippingAddress(address);
  toast.success("Address saved successfully!");
  };
 
  const BackButton = () => (
    <button className="back-btn" onClick={() => setView("details")}>
      <IoArrowBackCircleSharp size={24} style={{ marginRight: 6 }} />
      Back
    </button>
  );

  const renderDetails = () => (
    <div className="details-right">
      <h3>Details</h3>
      <div className="user-info">
        <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Phone:</strong> {currentUser?.phone}</p>
      </div>
      <h4 className="h">Default Address</h4>
      {currentUser?.shippingAddress ? (
        <div className="address-card">
          <p>{currentUser.shippingAddress.houseNumber}, {currentUser.shippingAddress.addressLine1}</p>
          <p>{currentUser.shippingAddress.addressLine2}</p>
          <p>{currentUser.shippingAddress.city}, {currentUser.shippingAddress.state} - {currentUser.shippingAddress.postalCode}</p>
        </div>
        ) : (
        <div className="no-address">
          <p>No default address added.</p>
          <button className="add-address-btn" onClick={() => setView("address")}>Add Address</button>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="details-right">
      <BackButton />
      <h3>My Orders</h3>
      {currentUser?.orders?.length ? (
        currentUser.orders.map((order, idx) => (
          <div key={idx} className="order-item">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Date:</strong> {order.date}</p>
          </div>
        ))
      ) : (
        <p>No orders placed yet.</p>
      )}
    </div>
  );

  const renderAddressForm = () => (
    <div className="details-right">
      <BackButton />
      <h3>Edit Address</h3>
      <div className="form-grid">
        <input name="houseNumber" placeholder="House Number" value={address.houseNumber} onChange={handleAddressChange} />
        <input name="postalCode" placeholder="Postal Code" value={address.postalCode} onChange={handleAddressChange} />
        <input name="addressLine1" placeholder="Address Line 1" value={address.addressLine1} onChange={handleAddressChange} />
        <input name="addressLine2" placeholder="Address Line 2" value={address.addressLine2} onChange={handleAddressChange} />
        <input name="city" placeholder="City" value={address.city} onChange={handleAddressChange} />
        <input name="state" placeholder="State" value={address.state} onChange={handleAddressChange} />
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="isDefault"
          checked={address.isDefault}
          onChange={handleAddressChange}
        />
        Make this my default address
      </label>
      <button className="save-btn" onClick={handleSaveAddress}>Save Changes</button>
    </div>
  );

  return (
    <>
      <Header />
      <div className="profile-page-container">
        <div className="left-pane">
          <h2>CAROAL Profile</h2>
          <div className="nav-card" onClick={() => setView("orders")}>
            <img src={box} alt="Orders" />
            <div>
              <h4 className="headers">Orders</h4>
              <p className="sub">Order Details / Track order</p>
            </div>
          </div>
          <div className="nav-card" onClick={() => setView("address")}>
            <FaMapMarkerAlt className="svg" />
            <div>
              <h4 className="headers">Address</h4>
              <p className="sub">Add / Change Address</p>
            </div>
          </div>
        <button
        className="logout-btn"
        onClick={() => {
          logoutUser();
          navigate("/signin", { replace: true }); // <-- 👈 replaces history entry
        }}
        >
          Log Out
        </button>
        </div>
        {view === "orders" ? renderOrders() :
         view === "address" ? renderAddressForm() :
         renderDetails()}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
