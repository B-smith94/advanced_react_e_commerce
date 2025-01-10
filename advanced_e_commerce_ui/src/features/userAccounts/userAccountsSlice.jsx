import { createSlice } from "@reduxjs/toolkit";

const userAccountsSlice = createSlice({
    name: 'userAccount',
    initialState: {
        user: null,
        error: null,
    },
    reducers: {
        logIn: (state, action) => { // if successfull, adds user to redux state
            state.user = action.payload;
            state.error = null;
        },
        logOut: (state) => { // if successfull, removes user from redux state
            state.user = null;
            state.error = null;
        },
        setError: (state, action) => { // handles errors
            state.error = action.payload;
        },
    },
});

export const { logIn, logOut, setError } = userAccountsSlice.actions;

export default userAccountsSlice.reducer