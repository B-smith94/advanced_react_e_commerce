import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk( 
    'products/fetchProducts', 

    async () => {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            // rejected
            throw new Error('Failed to fetch products');
        }
        //fulfilled
        const products = await response.json();
        return products;
    }
);

const productsSlice = createSlice({
    name: 'products', 
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => { // builder responds to actions not created within slice (fetchProducts in this case)
        builder // redux tells builder which status fetchProducts is on and runs the requisite code (under the hood stuff)
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Add fetched products to the state
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default productsSlice.reducer;