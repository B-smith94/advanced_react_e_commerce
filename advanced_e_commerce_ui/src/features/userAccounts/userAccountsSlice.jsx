import { createSlice } from "@reduxjs/toolkit";

const userAccountsSlice = createSlice({
    name: 'userAccount',
    initialState: {
        user: null,
        error: null,
    },
    reducers: {
        logIn: (state, action) => {
            state.user = action.payload;
            state.error = null;
        },
        logOut: (state) => {
            state.user = null;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { logIn, logOut, setError } = userAccountsSlice.actions;
export default userAccountsSlice.reducer