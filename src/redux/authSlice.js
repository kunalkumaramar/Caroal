import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const BASE_URL = 'https://carol-ecommerce.onrender.com';

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.data.accessToken);
        toast.success('Login Successful');
        return data.data;
      } else {
        toast.error(data.message || 'Login failed');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Signup Successful');
        return data.data;
      } else {
        toast.error(data.message || 'Signup failed');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// FETCH PROFILE
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log('👤 Profile fetched:', data.data);
        return data.data;
      } else {
        toast.error(data.message || 'Unauthorized');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      toast.error('Error fetching profile');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// GOOGLE LOGIN
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (code, thunkAPI) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.data.accessToken);
        toast.success('Google Sign-in Successful');
        return data.data;
      } else {
        toast.error(data.message || 'Google sign-in failed');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// UPDATE ADDRESS
export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ addresses, phone }, thunkAPI) => {
    try {
      console.log('📦 Sending to backend:',  phone );
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ addresses, phone }),
      });

      const data = await res.json();

      if (res.ok && data?.data) {
        console.log('✅ Response from backend:', data.data);
        toast.success('Profile updated successfully!');
        return data.data;
      } else {
        console.error('❌ Backend error:', data.message);
        toast.error(data.message || 'Failed to update profile');
        return thunkAPI.rejectWithValue(data.message);
      }
    } catch (err) {
      console.error('❌ Network error:', err.message);
      toast.error(err.message || 'Server error');
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('user')
      ? JSON.parse(null)
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      toast.info('Logged out');
    },
    restoreUser: (state, action) => {
    state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          ...action.payload,
          shippingAddress: action.payload.addresses?.find(addr => addr.isDefault) || action.payload.addresses?.[0] || null,
        };
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //UPDATE ADDRESS
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // ✅ set full user object returned from backend
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreUser } = authSlice.actions;
export default authSlice.reducer;