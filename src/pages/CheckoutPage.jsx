import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../redux/orderSlice';
import { fetchProfile } from '../redux/authSlice';
import { initiateRazorpay, handleRazorpaySuccess } from '../redux/paymentSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/components/CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const totals = useSelector((state) => state.cart.totals);
  const cartItems = useSelector((state) => state.cart.items);
  const formatAddress = (address, fallbackName = 'User', fallbackPhone = '0000000000') => ({
    name: user?.fullName || fallbackName,
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pinCode: address?.postalCode || '',
    country: 'India',
    phone: user?.phone || fallbackPhone,
  });

  const baseOrderData = {
    shippingAddress: formatAddress(user?.shippingAddress),
    billingAddress: formatAddress(user?.billingAddress || user?.shippingAddress),
    notes: 'Please deliver between 10am-5pm',
  };

  const handleCOD = () => {
    if (!user?.shippingAddress) {
      toast.error('Shipping address is incomplete.');
      return;
    }

    const orderData = {
      ...baseOrderData,
      paymentMethod: 'cod',
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then(() => {
        dispatch(fetchProfile());
        toast.success('Order placed successfully!');
        navigate('/profile');
      })
      .catch((err) => {
        console.error('Order placement error:', err);
        toast.error('Something went wrong while placing the order.');
      });
  };

  const handleRazorpayPayment = async () => {
    if (!user?.shippingAddress) {
      toast.error('Shipping address is incomplete.');
      return;
    }

    const orderData = {
      ...baseOrderData,
      paymentMethod: 'razorpay',
    };

    dispatch(placeOrder(orderData))
      .unwrap()
      .then((createdOrder) => {
        const orderId = createdOrder?.orderId;
        if (!orderId) throw new Error('Order ID missing for Razorpay');

        dispatch(initiateRazorpay({ orderId, userId: user?._id }))
          .unwrap()
          .then((paymentData) => {
            console.log("🔑 Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY);
            console.log('✅ Flattened paymentData:', paymentData);
            const options = {
              key: process.env.REACT_APP_RAZORPAY_KEY, 
              amount: paymentData.amount,
              currency: paymentData.currency,
              name: 'Caroal Store',
              description: 'Order Payment',
              order_id: paymentData.razorpayOrderId,
              handler: function (response) {
                console.log("🎯 Razorpay Response", response);
                const paymentDetails = {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  razorpayPayment: {
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    status: 'captured',
                  },
                };

                dispatch(handleRazorpaySuccess(paymentDetails))
                  .unwrap()
                  .then(() => {
                    dispatch(fetchProfile());
                    toast.success('Payment successful!');
                    navigate('/profile');
                  })
                  .catch(() => toast.error('Failed to verify Razorpay payment.'));
              },
              theme: {
                color: '#3399cc',
              },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
          })
          .catch((err) => {
            toast.error('Razorpay initiation failed.');
            console.error(err);
          });
      })
      .catch((err) => {
        toast.error('Order creation failed for Razorpay.');
        console.error(err);
      });
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <p>
        <strong>Shipping to:</strong>{' '}
        {user?.shippingAddress?.addressLine1}, {user?.shippingAddress?.city}
      </p>
      <p>
      <strong>Total:</strong> ₹{(totals?.subtotal ?? cartItems.reduce((acc, item) => {
          const price = item.product?.price || 0;
          const qty = item.quantity || 0;
          return acc + price * qty;
        }, 0)).toFixed(2)}
      </p>

      <button onClick={handleCOD}>Cash on Delivery</button>

      <button onClick={handleRazorpayPayment} style={{ marginTop: '10px', backgroundColor: '#000' }}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default CheckoutPage;
