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
    updateAddress: (state, action) => {
      if (state.user) {
        state.user.shippingAddress = action.payload;
        toast.success('Address updated');
      } else {
        toast.error('No user logged in');
      }
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
        localStorage.setItem('user', JSON.stringify(action.payload)); // 👈 save user
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
        state.user = action.payload;
        console.log("Fetched profile", action.payload);
        localStorage.setItem('user', JSON.stringify(action.payload)); 
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
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateAddress } = authSlice.actions;
export default authSlice.reducer;
