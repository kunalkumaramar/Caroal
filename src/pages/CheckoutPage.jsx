import {useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../redux/orderSlice';
import { fetchProfile } from '../redux/authSlice';
import { initiateRazorpay, handleRazorpaySuccess } from '../redux/paymentSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/components/CheckoutPage.css';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const placingRef = useRef(false);
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
    pinCode: address?.pinCode,
    country: 'India',
    phone: user?.phone || fallbackPhone,
  });

  const baseOrderData = {
    shippingAddress: formatAddress(user?.shippingAddress),
    billingAddress: formatAddress(user?.billingAddress || user?.shippingAddress),
    notes: 'Please deliver between 10am-5pm',
  };

 const handleCOD = () => {
  if (placingRef.current) return;
  placingRef.current = true;

  if (!user?.shippingAddress) {
    toast.error('Shipping address is incomplete.');
    placingRef.current = false;
    return;
  }
  if (!user?.shippingAddress?.pinCode) {
    toast.error('Shipping pincode is missing');
    placingRef.current = false;
  return;
  }

  const orderData = {
    ...baseOrderData,
    paymentMethod: 'cod',
    items: cartItems.map((item) => ({
      productId: item.product?._id || item.productId,
      quantity: item.quantity,
    })),
  };

  dispatch(placeOrder(orderData))
    .unwrap()
    .then(() => {
      dispatch(fetchProfile());
      navigate('/profile');
    })
    .catch((err) => {
      console.error('Order placement error:', err);
      toast.error(err.message || 'Something went wrong while placing the order.');
    })
    .finally(() => {
      placingRef.current = false;
    });
};

// checkout.jsx - Minor fixes
const handleRazorpayPayment = async () => {
  if (!user?.shippingAddress) {
    toast.error('Shipping address is incomplete.');
    return;
  }

  try {
    // 1. Create Order
    const createdOrder = await dispatch(placeOrder({
      ...baseOrderData,
      paymentMethod: 'razorpay'
    })).unwrap();

    if (!createdOrder?.orderId) throw new Error('Missing order ID');

    // 2. Initiate Razorpay Payment
    const paymentResponse = await dispatch(initiateRazorpay({
      orderId: createdOrder.orderId,
      userId: user._id
    })).unwrap();

    // Fix: Better error handling for nested response
    const paymentData = paymentResponse?.data || paymentResponse;
    
    if (!paymentData?.key || !paymentData?.order) {
      throw new Error('Invalid payment response structure');
    }
    
    console.log("Payment data:", paymentData);

    // 3. Configure Razorpay Options
    const options = {
      key: paymentData.key,
      amount: paymentData.order.amount,
      currency: paymentData.order.currency || 'INR',
      name: 'Caroal Store',
      description: `Order #${createdOrder.orderNumber}`,
      order_id: paymentData.order.id,
      handler: async (response) => {
        try {
          console.log('Razorpay response:', response); // Debug log
          
          await dispatch(handleRazorpaySuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            amount: paymentData.order.amount // Add this line
          })).unwrap();
          
          toast.success('Payment successful!');
          dispatch(fetchProfile()); // Refresh user data
          navigate('/profile');
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error(error.message || 'Payment verification failed');
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: () => {
          toast.info('Payment cancelled');
        }
      }
    };

    // 4. Open Razorpay
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', (response) => {
      console.error('Payment failed:', response.error);
      toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
    });
    
    rzp.open();

  } catch (error) {
    console.error('Payment error:', error);
    toast.error(error.message || 'Payment processing failed');
  }
};

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <p>
        <strong>Shipping to:</strong>{" "}
        {[user?.shippingAddress?.addressLine1,
          user?.shippingAddress?.addressLine2,
          user?.shippingAddress?.city,
          user?.shippingAddress?.state]
          .filter(Boolean)
          .join(", ")}{" "}
        - {user?.shippingAddress?.pinCode}
      </p>

      <p>
        <strong>Total:</strong> ₹{(() => {
          const subtotal = totals?.subtotal ?? cartItems.reduce((acc, item) => {
            const price = item.product?.price || 0;
            const qty = item.quantity || 0;
            return acc + price * qty;
          }, 0);

          const discount = totals?.discountAmount || 0;
          const shippingCharge = 10;
          const taxableAmount = subtotal - discount + shippingCharge;
          const tax = Math.round(0.18 * taxableAmount);
          const finalTotal = (taxableAmount + tax).toFixed(2);

          return finalTotal;
        })()}
      </p>

      <button onClick={handleCOD}>Cash on Delivery</button>

      <button onClick={handleRazorpayPayment} style={{ marginTop: '10px', backgroundColor: '#000' }}>
        Pay with Razorpay
      </button>
    </div>
  );
};

export default CheckoutPage;
