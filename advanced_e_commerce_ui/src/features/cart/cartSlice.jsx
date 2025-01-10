import { createSlice } from "@reduxjs/toolkit";

const initialState = { // defines initial state
    
    items: JSON.parse(sessionStorage.getItem('cartItems')) || {}, // pulls from session storage, or returns blank object if sessionStorage does not have cartItems
    totalItems: 0,
};

export const cartSlice = createSlice({ 
    name: 'cart', 
    initialState, 
    reducers: { 
        addItem: (state, action) => {
            const { id } = action.payload; // adds quantity of items to the cart
            if (state.items[id]) {
                state.items[id] += 1;
            } else {
                state.items[id] = 1;
            }
            state.totalItems += 1;
        },
        removeItem: (state, action) => {  // removes quantity of items from the cart
            const { id } = action.payload;
            if (state.items [id]) {
                state.items[id] -= 1; 
                if (state.items[id] === 0) {
                    delete state.items[id];
                }
                state.totalItems -= 1;
            }
        },
        deleteItem: (state, action) => { // removes items entirely from the cart
            const { id } = action.payload;
            if (state.items [id]) {
                delete state.items[id];
            }
        },
        checkout: (state) => { // handles chceckout - clears the state
            state.items={}; 
            state.totalItems = 0;
        },
    },
});

export const { addItem, removeItem, deleteItem, checkout } = cartSlice.actions;

export default cartSlice.reducer; 