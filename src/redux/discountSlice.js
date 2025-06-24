// src/redux/discountSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const BASE_URL = 'https://carol-ecommerce.onrender.com';

export const applyCoupon = createAsyncThunk(
  'discount/applyCoupon',
  async (code, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/discount/code/${code}`);
      const data = await res.json();
      if (res.ok) {
        toast.success(`Coupon ${data.data.code} applied!`);
        return data.data;
      } else {
        toast.error(data.message || 'Invalid or expired coupon');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error("Failed to apply coupon");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const discountSlice = createSlice({
  name: 'discount',
  initialState: {
    appliedCoupon: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null;
    },
    clearCoupon: (state) => {
      state.appliedCoupon = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedCoupon = action.payload;
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCoupon, clearAppliedCoupon } = discountSlice.actions;

export default discountSlice.reducer;
