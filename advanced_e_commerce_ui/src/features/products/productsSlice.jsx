import { createSlice} from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: 'products', 
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        sortProducts: (state, action) => {
            const criteria = action.payload; // allows sorting by price, name, and category
            if (criteria === 'Price asc.') {
                state.items.sort((a, b) => a.price - b.price);
            } else if (criteria === 'Price desc.') {
                state.items.sort((a, b) => b.price - a.price);
            } else if (criteria === 'Title') {
                state.items.sort((a, b) => a.title.localeCompare(b.title))
            } else if (criteria === 'Category') {
                state.items.sort((a, b) => a.category.localeCompare(b.category))
            }
        },
        setProducts: (state, action) => { // adds products to redux state for manipulation
            state.items = action.payload;
        }
    }
});

export const { sortProducts, setProducts } = productsSlice.actions;

export default productsSlice.reducer;