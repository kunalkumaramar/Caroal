import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productReducer from './productSlice';
import discountReducer from './discountSlice';
import orderReducer from './orderSlice';
import paymentReducer from './paymentSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    discount: discountReducer,
    order: orderReducer,
    payment: paymentReducer
  },
});

export default store;