import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productsSlice'
import userAccountsReducer from './features/userAccounts/userAccountsSlice';

export const store = configureStore({
    reducer: {
        userAccount: userAccountsReducer,
        products: productReducer,
        cart: cartReducer, 
    },
}); 

