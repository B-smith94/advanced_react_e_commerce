import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserAccounts = createAsyncThunk(
    'users/fetchUserAccounts',
    
    async () => {
        const response = await fetch('https://fakestoreapi.com/users');
        if (!response.ok) {
            throw new Error ('Failed to fetch users');
        }
        const accounts = response.json();
        return accounts;
    }
);

const userAccountsSlice = createSlice({
    name: 'userAccounts',
    initialState: {
        accounts: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        addUser: (state, action) => {
            state.accounts.push(action.payload);
        },
        deleteUser: (state, action) => {
            state.accounts.pop(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
         .addCase(fetchUserAccounts.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchUserAccounts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.accounts = action.payload;
         })
         .addCase(fetchUserAccounts.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
    },
});

export const { addUser, deleteUser } = userAccountsSlice.actions;
export default userAccountsSlice.reducer