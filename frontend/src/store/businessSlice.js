import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status : false,
    userData: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        currentBusiness: (state, action) => {
            state.businessData = action.payload.businessData;
        },
        
     }
})

export const {currentBusiness} = authSlice.actions;

export default authSlice.reducer;