// redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchProfile } from "./authSlice"; 

const BASE_URL = 'https://carol-ecommerce.onrender.com';
const token = () => localStorage.getItem('token');

// ✅ Create Order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully');
        return data.data;
      } else {
        toast.error(data.message || 'Failed to place order');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Order placement failed');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch Order Stats
export const fetchOrderStats = createAsyncThunk(
  'order/fetchOrderStats',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/order/stats`, {
        headers: {
          Authorization: `Bearer ${token()}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        return data.data;
      } else {
        toast.error(data.message || 'Failed to fetch stats');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch stats');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Get All Orders
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/order/orders`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token()}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        return data.data.orders; // Based on your API shape
      } else {
        toast.error(data.message || 'Failed to fetch orders');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error('Error fetching orders');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


// Cancel Order
export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/order/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token()}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order cancelled');
        thunkAPI.dispatch(fetchProfile());
        return data;
      } else {
        toast.error(data.message || 'Cancel failed');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error('Cancel error');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// PATCH Order Status
export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/order/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Order status updated');
        thunkAPI.dispatch(fetchProfile());
        return data;
      } else {
        toast.error(data.message || 'Failed to update status');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error('Status update error');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


// 🔁 Slice
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    stats: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
