// paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const BASE_URL = 'https://carol-ecommerce.onrender.com';
const token = () => localStorage.getItem('token');

// 🔹 1. Initiate Razorpay Payment
export const initiateRazorpay = createAsyncThunk(
  'payment/initiate',
  async ({ orderId, userId }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ orderId, user: userId, method: 'razorpay' }),
      });

      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        toast.error(data.message || 'Failed to initiate Razorpay');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error('Payment initiation failed');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔹 2. Handle Razorpay Success
export const handleRazorpaySuccess = createAsyncThunk(
  'payment/success',
  async (razorpayResponse, thunkAPI) => {
    try {
      console.log('📤 Sending to /payments/success:', razorpayResponse);
      const res = await fetch(`${BASE_URL}/payments/success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(razorpayResponse),
      });

      const data = await res.json();
      console.log('📥 Response from /payments/success:', data);
      if (res.ok) {
        toast.success('Payment verified successfully');
        return data;
      } else {
        toast.error(data.message || 'Payment verification failed');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error('Payment verification failed');
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔹 Payment Slice (Optional)
const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    paymentDetails: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initiateRazorpay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiateRazorpay.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentDetails = action.payload;
      })
      .addCase(initiateRazorpay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleRazorpaySuccess.fulfilled, (state) => {
        state.paymentDetails = null;
      });
  },
});

export default paymentSlice.reducer;
