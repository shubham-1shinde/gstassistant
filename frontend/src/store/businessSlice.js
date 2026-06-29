import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    businessData: {},
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        currentBusiness: (state, action) => {
            state.status = true;
            state.businessData = action.payload.businessData;
        },
        logoutCurrentBusiness: (state, action) => {
            state.status = false;
            state.businessData = null;
        },
        
     }
})

export const {currentBusiness, logoutCurrentBusiness} = authSlice.actions;

export default authSlice.reducer;