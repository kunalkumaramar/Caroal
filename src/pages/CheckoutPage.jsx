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

  try {
    // 1. Create Order
    const createdOrder = await dispatch(placeOrder({
      ...baseOrderData,
      paymentMethod: 'razorpay'
    })).unwrap();

    if (!createdOrder?.orderId) throw new Error('Missing order ID');

    // 2. Initiate Razorpay Payment
    const paymentData = await dispatch(initiateRazorpay({
      orderId: createdOrder.orderId,
      userId: user._id
    })).unwrap();

    console.log("payment Data: ",paymentData);
    


    // 4. Configure Razorpay Options
    const options = {
      key: paymentData.key, // From backend response
      amount: paymentData.order.amount, // Already in paise
      currency: paymentData.order.currency || 'INR',
      name: 'Your Store Name',
      description: `${createdOrder.orderNumber}`,
      order_id: paymentData.order.id, // Razorpay order ID
      handler: async (response) => {
        try {
          await dispatch(handleRazorpaySuccess({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })).unwrap();
          
          toast.success('Payment successful!');
          navigate('/orders');
        } catch (error) {
          toast.error('Payment verification failed');
        }
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phone
      },
      theme: {
        color: '#3399cc'
      }
    };

    console.log("options: ", options);
    

    // 5. Add error handlers
    options.modal = {
      ondismiss: () => {
        toast.info('Payment window closed');
      }
    };

    // 6. Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      toast.error(`Payment failed: ${response.error.description}`);
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
