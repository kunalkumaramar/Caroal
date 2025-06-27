import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/components/ProfilePage.css";
import box from "../assets/images/order.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cancelOrder, updateOrderStatus, fetchOrderStats, fetchAllOrders } from '../redux/orderSlice';
import { logout, updateAddress, fetchProfile } from "../redux/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const stats = useSelector((state) => state.order.stats);
  // console.log("Orders:", currentUser?.orders);
  const orders = useSelector((state) => state.order.orders);
  // console.log("Orders:", currentUser?.orders);
  const [view, setView] = useState("details");
  const [phoneInput, setPhoneInput] = useState(currentUser?.phone || "");
  const [address, setAddress] = useState({
    houseNumber: "",
    pinCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    isDefault: false,
  });
  const handleCancelOrder = (orderId) => {
  dispatch(cancelOrder(orderId))
  .unwrap()
  .then(() => {
    //toast.success("Order cancelled");
    // Order status already updated via backend
    dispatch(fetchAllOrders());
  })
  .catch((err) => {
    toast.error("Failed to cancel order");
    console.error(err);
  });
};
 useEffect(() => {
  const token = localStorage.getItem('token');
  if (!currentUser && token) {
    dispatch(fetchProfile());
  }
}, [dispatch, currentUser]);
  useEffect(() => {
  dispatch(fetchAllOrders());
}, [dispatch]);
useEffect(() => {
  if (currentUser?.phone) {
    setPhoneInput(currentUser.phone);
  }
}, [currentUser?.phone]);

  useEffect(() => {
    dispatch(fetchOrderStats()); // 👈 fetch stats on mount
  }, [dispatch]);
  useEffect(() => {
    if (currentUser?.shippingAddress) {
      setAddress({
        houseNumber: currentUser.shippingAddress?.addressLine1?.split(",")[0] || "",
        pinCode: currentUser.shippingAddress?.pinCode || "",
        addressLine1: currentUser.shippingAddress?.addressLine1?.split(",").slice(1).join(",").trim() || "",
        addressLine2: currentUser.shippingAddress?.addressLine2 || "",
        city: currentUser.shippingAddress?.city || "",
        state: currentUser.shippingAddress?.state || "",
        isDefault: currentUser.shippingAddress?.isDefault || false,
      });
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
    "pinCode",
    "addressLine1",
    "city",
    "state"
  ];

  const isEmpty = requiredFields.some((field) => !address[field]?.trim());

  if (isEmpty) {
    toast.error("Please fill in all required address fields.");
    return;
  }

  const formattedAddress = {
    name: "Home",
    addressLine1: `${address.houseNumber}, ${address.addressLine1}`,
    addressLine2: address.addressLine2 || "",
    city: address.city,
    state: address.state,
    pinCode: address.pinCode,
    isDefault: address.isDefault
  };

  const updatedAddresses = (currentUser?.addresses || [])
      .filter((a) => !a.isDefault) // remove old default
      .concat(formattedAddress); // add new one

    dispatch(updateAddress({ addresses: updatedAddresses, phone: phoneInput }))
      .unwrap()
      .then(() => {
        dispatch(fetchProfile());
        toast.success("Address saved!");
        setView("details");
      })
      .catch(() => {
        toast.error("Failed to save address");
      });
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
        <p><strong>Phone:</strong> {currentUser?.phone || (
          <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => setView("phone")}>
            Not Provided (Click to Add)
          </span>
        )}</p>
      </div>
      <h4 className="h">Default Address</h4>
      {currentUser?.addresses?.length ? (
        currentUser.addresses
          .filter(addr => addr.isDefault)
          .map((addr, index) => (
            <div key={index} className="address-card">
              <p>{addr.addressLine1}, {addr.addressLine2}</p>
              <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
            </div>
          ))
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
    {orders?.length ? (
    orders.map((order, idx) => (
    <div key={idx} className="order-item">
      <p><strong>Order Number:</strong> {order.orderNumber}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Items:</strong> {order.items?.length}</p>

      {/* 👇 Add cancel button if status is 'pending' */}
      {order.status === 'pending' ? (
        <button onClick={() => handleCancelOrder(order._id)}>
          Cancel Order
        </button>
      ) : order.status === 'cancelled' ? (
        <p className="cancelled-status" style={{ color: 'red' }}>
          Order Cancelled
        </p>
      ) : (
        <p className="order-status" style={{ color: 'green' }}>
          Status: {order.status}
        </p>
      )}

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
        <input name="pinCode" placeholder="Postal Code" value={address.pinCode} onChange={handleAddressChange} />
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
  const handlePhoneUpdate = () => {
  if (!phoneInput.trim() || phoneInput.length < 10) {
    toast.error("Please enter a valid phone number.");
    return;
  }

  const updatedUser = {
    ...currentUser,
    phone: phoneInput.trim()
  };

  dispatch(updateAddress({
  addresses: currentUser.addresses || [],
  phone: phoneInput.trim()
  })) 
    .then(() => {
      dispatch(fetchProfile());
      toast.success("Phone number updated!");
      setView("details");
    })
    .catch(() => toast.error("Failed to update phone number."));
};

const renderPhoneForm = () => (
  <div className="details-right">
    <BackButton />
    <h3>Update Phone Number</h3>
    <input
      type="tel"
      className="phone"
      value={phoneInput}
      onChange={(e) => setPhoneInput(e.target.value)}
      placeholder="Enter your phone number"
    />
    <button className="save-btn" onClick={handlePhoneUpdate}>Save</button>
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
              dispatch(logout());
              navigate("/signin", { replace: true });
            }}
          >
            Log Out
          </button>
        </div>
        {view === "orders"
          ? renderOrders()
          : view === "address"
          ? renderAddressForm()
          : view === "phone"
          ? renderPhoneForm()
          : renderDetails()}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
