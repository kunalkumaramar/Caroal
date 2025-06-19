import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const BASE_URL = 'https://carol-ecommerce.onrender.com';

const token = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token()}`
});


export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/details`, {
      method: 'GET',
      headers: headers(),
    });
    const data = await res.json();
    if (res.ok) return data;
    return thunkAPI.rejectWithValue(data.message || 'Failed to fetch cart');
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (item, thunkAPI) => {
  try {
    const payload = {
      product: item.productId,
      quantity: item.quantity || 1,
      size: item.size?.toLowerCase(), 
    };

    console.log("Sending payload: ", payload);
    

    const res = await fetch(`${BASE_URL}/cart`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
    });
    console.log('Status:', res.status)
    const data = await res.json();
    console.log('Response body:', data);
    if (res.ok) {
      toast.success('Item added to cart');
      return data;
    }
    toast.error(data.message);
    return thunkAPI.rejectWithValue(data.message);
  } catch (err) {
    toast.error(err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, updatedData }, thunkAPI) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updatedData),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Cart item updated');
      return data;
    }
    toast.error(data.message);
    return thunkAPI.rejectWithValue(data.message);
  } catch (err) {
    toast.error(err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/removeCartItem', async (itemId, thunkAPI) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: headers(),
    });
    const data = await res.json();
    if (res.ok) {
      toast.info('Item removed');
      return data;
    }
    toast.error(data.message);
    return thunkAPI.rejectWithValue(data.message);
  } catch (err) {
    toast.error(err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const applyDiscount = createAsyncThunk('cart/applyDiscount', async (discountData, thunkAPI) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/apply-discount`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(discountData),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Discount applied');
      return data;
    }
    toast.error(data.message);
    return thunkAPI.rejectWithValue(data.message);
  } catch (err) {
    toast.error(err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const res = await fetch(`${BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: headers(),
    });
    const data = await res.json();
    if (res.ok) {
      toast.info('Cart cleared');
      return data;
    }
    toast.error(data.message);
    return thunkAPI.rejectWithValue(data.message);
  } catch (err) {
    toast.error(err.message);
    return thunkAPI.rejectWithValue(err.message);
  }
});

// ---------------------------------------------
// Slice

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    items: [],
    totals: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const loading = (state) => { state.loading = true; state.error = null; };
    const failed = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchCart.pending, loading)
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
        state.items = action.payload.data.items || [];
        state.totals = action.payload.totals;
      })
      .addCase(fetchCart.rejected, failed)

      .addCase(addToCart.pending, loading)
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Optional: fetchCart again or update items
      })
      .addCase(addToCart.rejected, failed)

      .addCase(updateCartItem.pending, loading)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCartItem.rejected, failed)

      .addCase(removeCartItem.pending, loading)
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const removedId = action.meta.arg; // itemId passed in dispatch(removeCartItem(itemId))
        state.items = state.items.filter(item => item._id !== removedId && item.id !== removedId);
      })
      .addCase(removeCartItem.rejected, failed)

      .addCase(applyDiscount.pending, loading)
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(applyDiscount.rejected, failed)

      .addCase(clearCart.pending, loading)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totals = {};
      })
      .addCase(clearCart.rejected, failed);
  },
});

export default cartSlice.reducer;
