import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseURL = 'https://carol-ecommerce.onrender.com/product';

// 1. Create product (Admin only)
export const createProduct = createAsyncThunk('product/create', async (productData, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/create`, {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${localStorage.getItem('token')}`
      },

      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 2. Update product (Admin only)
export const updateProduct = createAsyncThunk('product/update', async ({ id, updates }, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 3. Get paginated product list
export const getProducts = createAsyncThunk(
  'product/getProducts',
  async ({ page = 1, limit = 10, sort = 'price' }, thunkAPI) => {
    try {
      const res = await fetch(`${baseURL}?page=${page}&limit=${limit}&sort=${sort}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch products');

      // ✅ return only products array
      return json.data.products;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 4. Search products
export const searchProducts = createAsyncThunk('product/search', async ({ q, page = 1, limit = 10 }, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Search failed');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 5. Get single product by ID
export const getProductById = createAsyncThunk('product/getById', async (id, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 6. Get sizes for product
export const getProductSizes = createAsyncThunk('product/sizes', async (productId, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/${productId}/sizes`);
    if (!res.ok) throw new Error('Failed to fetch sizes');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// 7. Get products by category
export const getProductsByCategory = createAsyncThunk('product/byCategory', async ({ categoryId, page = 1, limit = 10 }, thunkAPI) => {
  try {
    const res = await fetch(`${baseURL}/category/${categoryId}?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch category products');
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    current: null,
    sizes: [],
    searchResults: [],
    categoryProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProductState: (state) => {
      state.current = null;
      state.sizes = [];
      state.searchResults = [];
      state.categoryProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // ✅ This is your products array
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(getProductById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(getProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(searchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(searchProducts.fulfilled, (s, a) => { s.loading = false; s.searchResults = a.payload; })
      .addCase(searchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(getProductsByCategory.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(getProductsByCategory.fulfilled, (s, a) => { s.loading = false; s.categoryProducts = a.payload; })
      .addCase(getProductsByCategory.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(getProductSizes.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(getProductSizes.fulfilled, (s, a) => { s.loading = false; s.sizes = a.payload; })
      .addCase(getProductSizes.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createProduct.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createProduct.fulfilled, (s, a) => { s.loading = false; s.list.push(a.payload); })
      .addCase(createProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateProduct.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.loading = false;
        const index = s.list.findIndex(p => p._id === a.payload._id);
        if (index >= 0) s.list[index] = a.payload;
      })
      .addCase(updateProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
